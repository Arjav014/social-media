import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { userProfile } = useSelector((state) => state.auth);
  const isLoggedInUserProfile = true;
  const isFolllowing = true;

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2 gap-8">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profile-picture"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="">{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Button
                      variant="secondary"
                      className="hover:bg-slate-200 h-8 rounded-lg"
                    >
                      Edit profile
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-slate-200 h-8 rounded-lg"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-slate-200 h-8 rounded-lg"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFolllowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className="hover:bg-slate-200 h-8 rounded-lg"
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-slate-200 h-8 rounded-lg"
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="bg-blue-500 hover:bg-blue-600 h-8 rounded-lg">
                      Follow
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-10">
                <p className="text-sm">
                  <span className="font-semibold text-lg mr-1">
                    {userProfile?.posts.length}
                  </span>
                  posts
                </p>
                <p className="text-sm">
                  {" "}
                  <span className="font-semibold text-lg mr-1">
                    {userProfile?.followers.length}
                  </span>
                  followers
                </p>
                <p className="text-sm">
                  {" "}
                  <span className="font-semibold text-lg mr-1">
                    {userProfile?.following.length}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign size={22} />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span className="py-3 cursor-pointer">
              POSTS
            </span>
            <span className="py-3 cursor-pointer">
              SAVED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
