import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const Suggestedusers = () => {
  const { suggestedUsers } = useSelector(store=>store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-500">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div key={user._id} className="flex items-center justify-between my-5">
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
            <span className="text-blue-500 text-[13px] font-bold cursor-pointer hover:text-blue-600">Follow</span>
          </div>
        );
      })}
    </div>
  );
};

export default Suggestedusers;
