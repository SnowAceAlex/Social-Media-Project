import React from "react";
import useProfile from "../hook/useProfile";

function ProfilePage() {
  const { profile, error } = useProfile();

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  if (!profile) {
    return <div className="p-4">Loading...</div>;
  }
  return (
    <>
      <div className="w-full border h-72">
        <div className="w-full h-4/5 bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4] relative">
          <div
            className="absolute -bottom-8 left-8 w-28 aspect-square rounded-full 
                                    border-4 border-white overflow-hidden bg-gray-300"
          >
            {/* Profile picture here*/}
          </div>
        </div>
      </div>

      <div className="p-4 mt-12">
        <h1 className="text-2xl font-semibold">{profile.username}</h1>
        <p className="text-gray-600">{profile.email}</p>
      </div>
    </>
  );
}

export default ProfilePage;