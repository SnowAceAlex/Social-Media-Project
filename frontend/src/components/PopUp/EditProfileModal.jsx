import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import useProfile from "../../hook/useProfile";

const EditProfileModal = ({ onClose }) => {
    const { profile, loading } = useProfile();
    const [imageInputType, setImageInputType] = useState("file");

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
                dob: profile.dob || "",  
                bio: profile.bio || "",
                imageUrl: profile.profile_pic_url || "",
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full z-[99] bg-black/50 bg-opacity-50 
                        flex items-center justify-center dark:text-dark-text">
            <div className="bg-white dark:bg-dark p-6 
                            w-[30rem]
                            max-h-[90vh] rounded-xl overflow-auto">
                <div className="flex w-full justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit your profile</h2>
                    <IoCloseOutline 
                        size={28}
                        onClick={onClose} 
                        title="Close"
                        className="p-1 bg-light-button hover:bg-light-button-hover
                                    dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text
                                    rounded-full cursor-pointer"/>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="w-full h-[6rem] rounded-3xl px-4
                                        flex items-center gap-4
                                        bg-light-card border border-light-border
                                        shadow-sm
                                        dark:bg-dark-card dark:border-dark-border dark:shadow-[0_1px_2px_rgba(255,255,255,0.05)]">
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
                        {/* Username */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="username" className="text-sm font-medium">Username</label>
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
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border rounded p-2 border-light-input-border dark:bg-dark-input dark:border-dark-border"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
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
                            <label htmlFor="dob" className="text-sm font-medium">Date of Birth</label>
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
                            <label htmlFor="bio" className="text-sm font-medium">Bio</label>
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
                                <input type="file" className="border rounded p-2 border-light-input-border dark:bg-dark-input dark:border-dark-border" />
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
                            <button className="bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4] 
                                    text-white px-4 py-2 rounded 
                                    hover:bg-light-button-hover cursor-pointer">
                                Save
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-light-button text-black px-4 py-2 rounded 
                                hover:bg-light-button-hover dark:bg-dark-button dark:text-white dark:hover:bg-dark-button-hover
                                cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProfileModal;
