import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image)
      return res.status(400).json({ message: "Please add an image." });

    // image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "Post created successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.log("Error creating a new post: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getAllPost = async (_, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      message: "Posts retrieved successfully",
      posts: posts,
      success: true,
    });
  } catch (error) {
    console.log("Error fetching all posts: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      message: "Posts retrieved successfully",
      posts: posts,
      success: true,
    });
  } catch (error) {
    console.log("Error fetching user posts: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKrneWala = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    // like logic
    await post.updateOne({ $addToSet: { likes: likeKrneWala } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWala).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrneWala) {
      // emit a notification event
      const notification = {
        type: "like",
        userId: likeKrneWala,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log("Error liking post: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeKrneWala = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    // like logic
    await post.updateOne({ $pull: { likes: likeKrneWala } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWala).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrneWala) {
      // emit a notification event
      const notification = {
        type: "dislike",
        userId: likeKrneWala,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log("Error liking post: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWala = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) {
      return res
        .status(400)
        .json({ message: "Text is required", success: false });
    }

    const comment = await Comment.create({
      text,
      author: commentKrneWala,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log("Error adding comment: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username, profilePicture",
    });

    if (!comments) {
      return res
        .status(404)
        .json({ message: "No comments found", success: false });
    }

    return res.status(201).json({
      message: "Comments fetched",
      comments,
      success: true,
    });
  } catch (error) {
    console.log("Error getting comments: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    // check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "You are not the owner of this post",
        success: false,
      });
    }

    // delete Post
    await Post.findByIdAndDelete(postId);

    // remove the post id from the user's post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted",
      success: true,
    });
  } catch (error) {
    console.log("Error deleting post: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    const user = await User.findById(authorId);

    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ message: "Post unbookmarked", success: true });
    } else {
      // not bookmarked -> add
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log("Error getting comments: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
