import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req,res) => {
    try {
        const {username, email, password} = req.body;

        // Validate input
        if(!username || !email || !password) {
            return res.status(400).json({
                message:"All fields are required",
                success:false
            })
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(409).json({
                message:"User with this email already exists",
                success:false
            })
        }

        // Check if the username is already taken
        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(409).json({
                message:"Username already taken",
                success:false
            })
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })
        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            data: newUser
        });
    } catch (error) {
        console.log("Error during registration: ",error);
        return res.status(500).json({
            message: "An error occurred while registering the user",
            success: false
        });
    }
};

export const login = async (req,res) => {
    try {
        const {email, password} = req.body;

        // Validate input
        if(!email || !password) {
            return res.status(400).json({
                message:"Email and password are required",
                success:false
            })
        }

        // Find user by email
        let user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn:'3d'});
        res.cookie('token', token, {
            httpOnly:true, 
            sameSite:'strict',
            maxAge: 3*24*60*60*1000
        });

        // populate each post in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map(async(postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }

        return res.status(200).json({
            message: `Welcome back, ${user.username}`,
            success: true,
            user
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            message: "An error occurred while logging in",
            success: false
        });
    }
};

export const logout = async (_,res) => {
    try {
        // Clears the JWT token
        res.clearCookie('token');

        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({
            message: "An error occurred while logging out",
            success: false
        });
    }
};

export const getProfile = async (req,res) => {
    try {
        const userId = req.params.id;

        // Find user by id, excluding the password
        let user = await User.findById(userId).select("-password");
        
        // check if user exists or not
        if(!user) {
            return res.status(404).json({
              message: "User not found",
              success: false,
            });
        }

        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the user profile",
            success: false,
        });
    }
};

export const editProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
    
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            message: "An error occurred while updating the profile",
            success: false,
        });
    }
};

export const getSuggestedUsers = async (req,res) => {
    try {
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message: "No suggested users found",
                success: false
            })
        };

        return res.status(200).json({
            message: "Suggested users found",
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.error("Error fetching suggested users:", error);
        return res.status(500).json({
            message: "An error occurred while fetching suggested users",
            success: false
        });
    }
};

export const followOrUnfollow = async (req,res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;

        if(followKrneWala === jiskoFollowKrunga){
            return res.status(400).json({
                message: "You can't follow yourself",
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if(!user || !targetUser){
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // check follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);

        if(isFollowing){
            // unfollow logic
            await Promise.all([
                User.updateOne({_id:followKrneWala},{$pull:{following:jiskoFollowKrunga}}),
                User.updateOne({_id:jiskoFollowKrunga},{$pull:{followers:followKrneWala}})
            ])
            return res.status(200).json({message:"Unfollowed successfully"});
        } else {
            // follow logic
            await Promise.all([
                User.updateOne({_id:followKrneWala},{$push:{following:jiskoFollowKrunga}}),
                User.updateOne({_id:jiskoFollowKrunga},{$push:{followers:followKrneWala}})
            ])
            return res.status(200).json({message:"Followed successfully"});
        }

    } catch (error) {
        console.error("Error following or unfollowing user:", error);
        return res.status(500).json({
            message: "An error occurred while following or unfollowing user",
            success: false
        });
    }
}