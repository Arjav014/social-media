import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    alert(text);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-4xl p-0"
      >
        <DialogTitle className="sr-only">Comments</DialogTitle>
        <DialogDescription className="sr-only">
          View and add comments on the post.
        </DialogDescription>

        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="rounded-l-lg w-full h-full object-cover"
              src="https://img.freepik.com/free-vector/pair-programming-concept-illustration_114360-1812.jpg?ga=GA1.1.757731979.1724187216&semt=ais_hybrid"
              alt="post"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-medium text-lg">username</Link>
                </div>
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
                        <Button
                          variant="ghost"
                          className="cursor-pointer w-fit m-1"
                        >
                          Add to favourites
                        </Button>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <hr className="border-t border-gray-300" />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              comments ayenge
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={text}
                  onChange={changeEventHandler}
                  className="w-full outline-none border border-gray-300 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
