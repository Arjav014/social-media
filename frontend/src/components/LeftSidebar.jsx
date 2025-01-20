import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Heart,
  Home,
  LogOut,
  MessagesSquare,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open,setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if(textType === "Create") {
      setOpen(true);
    }
  };

  const sidebarItems = [
    { label: "Home", icon: <Home /> },
    { label: "Search", icon: <Search /> },
    { label: "Explore", icon: <TrendingUp /> },
    { label: "Message", icon: <MessagesSquare /> },
    { label: "Notifications", icon: <Heart /> },
    { label: "Create", icon: <PlusSquare /> },
    {
      label: "Profile",
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
    },
    { label: "Logout", icon: <LogOut /> },
  ];

  return (
    <div className="fixed top-0 left-0 z-10 px-4 border-r border-gray-800 w-[16%] h-screen">
      <div className="flex flex-col">
        <div className="mb-8 mt-1">
          <h1 className="p-3 text-xl font-extrabold text-gray-900 border-b border-gray-800 font-comfortaa">
            ChitChat
          </h1>
        </div>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.label)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-2"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  );
};

export default LeftSidebar;
