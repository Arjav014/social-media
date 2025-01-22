import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Bookmark, MessageCircle, Send } from "lucide-react";
import CommentDialog from "./CommentDialog";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  return (
    <div className="my-6 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger />
              <NavigationMenuContent>
                <NavigationMenuLink>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit m-1 text-red-500"
                  >
                    Unfollow
                  </Button>
                </NavigationMenuLink>
                <NavigationMenuLink>
                  <Button variant="ghost" className="cursor-pointer w-fit m-1">
                    Add to favourites
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <img
        className="rounded-sm my-2 w-full aspesct-square object-cover"
        src={post.image}
        alt="post"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaRegHeart
            size={"23px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block my-2">{post.likes.length} likes</span>
      <p>
        <span className="font-semibold mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm text-gray-400"
      >
        View all 10 comments...
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-blue-600">post</span>}
      </div>
    </div>
  );
};

export default Post;
