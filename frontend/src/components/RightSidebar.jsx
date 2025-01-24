import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Suggestedusers from "./Suggestedusers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="my-10 w-52 mr-20">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-medium text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-500 max-w-24 text-sm whitespace-nowrap overflow-hidden text-ellipsis block">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      <Suggestedusers/>
    </div>
  );
};

export default RightSidebar;
