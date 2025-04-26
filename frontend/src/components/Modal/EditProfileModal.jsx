import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import useProfile from "../../hook/useProfile";
import { useEditProfileService } from "../../hook/useEditProfileService";
import { getCurrentUser } from "../../helpers/getCurrentUser";
import { motion } from 'framer-motion'; 
import { useOutletContext } from "react-router-dom";
import { useUploadService } from "../../hook/useUploadService";

const EditProfileModal = ({ onClose, showGlobalToast, setShowLoading }) => {
  const {currentUser} = getCurrentUser();
  const { profile, loading, error } = useProfile(currentUser?.user?.id);
  const [imageInputType, setImageInputType] = useState("file");
  const {uploadSingle} = useUploadService();
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    dob: "",
    bio: "",
    imageUrl: "",
  });

  // Prefill form when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        full_name: profile.full_name || "",
        dob: profile.date_of_birth ? profile.date_of_birth.slice(0, 10) : "",
        bio: profile.bio || "",
        imageUrl: profile.profile_pic_url || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { handleSaveProfile } = useEditProfileService (() => {
      showGlobalToast("Profile updated!", "success");
      onClose(); 
    },
    (errMessage) => {
      showGlobalToast("Failed to update profile", "error");
    }
  );
  
  const handleSave = async () => {
    try {
      setShowLoading(true); 
      let finalUrl = formData.imageUrl;
      let finalPublicId = null;
  
      if (imageInputType === "file" && selectedFile) {
        const uploaded = await uploadSingle(selectedFile, "avatar", currentUser?.user?.id);
        finalUrl = uploaded.url;
        finalPublicId = uploaded.publicId;
      }
  
      const dataToSave = {
        ...formData,
        profile_pic_url: finalUrl,
        profile_pic_public_id: finalPublicId,
      };
  
      handleSaveProfile(dataToSave);
    } catch (err) {
      showGlobalToast("Upload failed", "error");
      console.error("❌ Error uploading avatar:", err);
    } finally{
      setShowLoading(false);
    }
  };  

  

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[99] bg-black/50 bg-opacity-50 
                        flex items-center justify-center dark:text-dark-text"
    >
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white dark:bg-dark
                            w-[30rem]
                            max-h-[90vh] rounded-xl overflow-hidden
                            "
      >
        <div className="overflow-y-auto p-6 max-h-[90vh]">
        <div className="sticky top-0 z-10 flex flex-col gap-2 pb-4 bg-white dark:bg-dark">
          <div className="flex w-full justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit your profile</h2>
            <IoCloseOutline
              size={28}
              onClick={onClose}
              title="Close"
              className="p-1 bg-light-button hover:bg-light-button-hover
                        dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text
                        rounded-full cursor-pointer"
            />
          </div>

          {loading ? (
            <div
              className="w-full h-[6rem] rounded-3xl px-4
                        flex items-center gap-4
                        bg-light-card border border-light-border
                        shadow-sm animate-pulse
                        dark:bg-dark-card dark:border-dark-border dark:shadow-[0_1px_2px_rgba(255,255,255,0.05)]"
            >
              <div className="h-[70%] aspect-square bg-gray-300 rounded-full dark:bg-dark-border" />
              <div className="flex flex-col gap-2 w-full">
                <div className="w-1/3 h-4 bg-gray-300 rounded dark:bg-dark-border" />
                <div className="w-1/2 h-3 bg-gray-200 rounded dark:bg-dark-border" />
              </div>
            </div>
          ) : (
            <div
              className=" w-full h-[6rem] rounded-3xl px-4
                        flex items-center gap-4
                        bg-light-card border border-light-border
                        shadow-sm
                        dark:bg-dark-card dark:border-dark-border dark:shadow-[0_1px_2px_rgba(255,255,255,0.05)]"
            >
              <img
                src={formData.imageUrl || profile.profile_pic_url}
                alt={formData.username || profile.username}
                className="h-[70%] aspect-square object-cover rounded-full"
              />
              <span className="text-black text-xl font-semibold drop-shadow dark:text-dark-text flex flex-col gap-1">
                {formData.username || profile.username}
                <span className="text-[0.8rem] text-gray-500 dark:text-dark-text-subtle font-normal flex gap-2 text-nowrap">
                  {formData.full_name || profile.full_name}
                </span>
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500"></div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border rounded p-2 border-light-input-border dark:bg-dark-input dark:border-dark-border"
                placeholder="Enter your username"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={true}
                className="border rounded p-2 border-light-input-border 
                                        bg-light-input-disabled text-light-input-disabled-text
                                        dark:bg-dark-input-disabled dark:text-dark-input-disabled-text dark:border-dark-border 
                                        focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="full_name" className="text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="border rounded p-2 border-light-input-border dark:bg-dark-input dark:border-dark-border"
                placeholder="Enter your full name"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-2">
              <label htmlFor="dob" className="text-sm font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="border rounded p-2 border-light-input-border dark:bg-dark-input dark:border-dark-border"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="border rounded p-2 border-light-input-border dark:bg-dark-input dark:border-dark-border"
                placeholder="Enter your bio"
              />
            </div>

            {/* Profile Picture Input Type */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Profile Picture</label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-1 border-light-input-border dark:bg-dark-input dark:border-dark-border">
                  <input
                    type="radio"
                    name="picInputType"
                    value="file"
                    checked={imageInputType === "file"}
                    onChange={() => setImageInputType("file")}
                  />
                  Upload File
                </label>
                <label className="flex items-center gap-1 border-light-input-border dark:bg-dark-input dark:border-dark-border">
                  <input
                    type="radio"
                    name="picInputType"
                    value="url"
                    checked={imageInputType === "url"}
                    onChange={() => setImageInputType("url")}
                  />
                  Image URL
                </label>
              </div>

              {imageInputType === "file" ? (
                <input
                  type="file"
                  className="border rounded p-2 border-light-input-border dark:bg-dark-input dark:border-dark-border"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData((prev) => ({ ...prev, imageUrl: reader.result })); // hiển thị ảnh preview
                      };
                      reader.readAsDataURL(file);
                      setSelectedFile(file); // dùng cho upload thật
                    }  
                  }}
                />
              ) : (
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="border rounded p-2 border-light-input-border dark:bg-dark-input dark:border-dark-border"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleSave}
                className="bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4] 
                                    text-white px-4 py-2 rounded 
                                    hover:bg-light-button-hover cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="bg-light-button text-black px-4 py-2 rounded 
                            hover:bg-light-button-hover dark:bg-dark-button dark:text-white dark:hover:bg-dark-button-hover
                            cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
