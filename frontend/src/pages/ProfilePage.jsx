import React from "react";
import useProfile from "../hook/useProfile";
import PostCard from "../components/PostCard";
import { LiaEdit } from "react-icons/lia";
import { useOutletContext } from "react-router-dom";

function ProfilePage() {
  const { profile, loading, error } = useProfile();
  const { setShowEditModal } = useOutletContext();

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="md:ml-9 lg:ml-0">
      <div className="w-full h-72 mb-12">
        <div className="w-full h-4/5 bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4] relative">
          <div className="absolute -bottom-20 left-8 flex items-end gap-4">
            {/* Avatar */}
            <div className="w-36 aspect-square rounded-full border-4 border-white overflow-hidden bg-gray-300 dark:border-dark">
              {loading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse"></div>
              ) : (
                <img
                  src={profile.profile_pic_url}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* User Info */}
            <span className="text-black text-2xl font-bold drop-shadow dark:text-dark-text flex flex-col gap-2 absolute left-[10rem] top-20 
                            w-[10rem] sm:w-[14rem] md:w-[12rem] lg:w-[20rem] xl:w-[25rem] ">
              {loading ? (
                <>
                  <div className="w-48 h-6 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-64 h-4 bg-gray-300 rounded animate-pulse mt-1"></div>
                  <div className="w-72 h-4 bg-gray-300 rounded animate-pulse mt-1"></div>
                </>
              ) : (
                <>
                  {profile.username}
                  <span className="text-[1rem] text-gray-500 font-medium flex gap-2 text-nowrap">
                    <span>
                      <span className="text-black dark:text-dark-text">134</span> Follower
                    </span>
                    <span>
                      <span className="text-black dark:text-dark-text">1</span> Following
                    </span>
                  </span>
                  <span className="text-[1rem] text-gray-500 font-medium">{profile.bio}</span>
                </>
              )}
            </span>
          </div>

          {/* Edit Button */}
          <LiaEdit
            size={40}
            className="absolute -bottom-15 right-8 p-2 rounded-xl bg-light-button flex justify-center items-center text-black cursor-pointer hover:bg-light-button-hover transition dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text"
            title="Edit Profile"
            onClick={() => setShowEditModal(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;