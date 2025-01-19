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
import React from "react";

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
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn"/>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
  },
  { label: "Logout", icon: <LogOut /> },
];

const LeftSidebar = () => {
  return (
    <div className>
      {sidebarItems.map((item, index) => {
        return (
          <div key={index}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default LeftSidebar;
