import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import useProfile from "../../hook/useProfile";
import CaptionTextarea from "../CaptionTextarea";
import UploadBlock from "../UploadBlock";
import { useCreatePostService } from "../../hook/useCreatePostService";
import Avatar_Username from "../Avatar_Username";
import { getCurrentUser } from "../../helpers/getCurrentUser";
import usePostService from "../../hook/usePostService";
import { useOutletContext } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { motion } from "framer-motion";

const EditPostModal = ({ post, profile, loading, onClose }) => {
    const [caption, setCaption] = useState(post.caption || "");
    const { editPost, loading: editLoading } = usePostService();
    const { showGlobalToast } = useOutletContext();

    const handleEdit = async () => {
        try {
        await editPost(post.id, { caption });
        showGlobalToast("Post updated!", "success");
        onClose();
        } catch (err) {
        console.error("Error updating post:", err);
        showGlobalToast("Failed to update post.", "error");
        }
    };
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    useEffect(() => {
        setCurrentImgIndex(0);
    }, [post.id]);

    return (
        <div
        className="fixed top-0 left-0 w-full h-full z-[99] bg-black/50
                            flex items-center justify-center dark:text-dark-text"
        >
        <IoCloseOutline
            size={45}
            onClick={onClose}
            title="Close"
            className="p-1 dark:text-dark-text text-light
                                rounded-full cursor-pointer hidden md:flex
                                absolute right-6 top-4 z-10"
        />
        <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`bg-white dark:bg-dark
                ${
                    (post.images && post.images.length > 0) ? 
                    "w-[30rem] md:w-[50rem] lg:w-[60rem] xl:w-[70rem]" :
                    "w-[30rem] md:w-[35rem]"
                }
                max-h-[95vh] overflow-auto shadow-md relative`}
        >
            <div className="flex flex-col md:flex-row gap-6 px-4 py-6 md:h-[90vh] md:p-0 overflow-hidden">
            <div className="order-1 md:order-2 w-full md:flex-3">
                <div className="relative flex items-center justify-center pb-4 md:p-4 border-b border-light-border dark:border-dark-border">
                <span className="text-xl font-semibold text-center">
                    Post of {profile?.username}
                </span>
                <IoCloseOutline
                    size={28}
                    onClick={onClose}
                    title="Close"
                    className="p-1 bg-light-button hover:bg-light-button-hover md:hidden
                                        dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text
                                        rounded-full cursor-pointer absolute right-0 top-0"
                />
                </div>

                <div className={`w-full flex items-center gap-4 md:mb-2
                                    ${
                                        (post.images && post.images.length > 0) ? 
                                        "pl-2 py-4" : "pl-6 py-4"
                                    }`}>
                <Avatar_Username
                    profile={profile}
                    loading={loading}
                    createdAt={post.created_at}
                />
                </div>
                <div className={`${(post.images && post.images.length > 0) ? "ml-2" : "ml-6"}`}>
                    <CaptionTextarea value={caption} onChange={setCaption} />                    
                </div>
            </div>

            {/* Image block - order second on mobile, first on desktop */}
            {post.images?.length > 0 && (
                <div
                className="order-2 md:order-1 w-full md:flex-4 md:aspect-auto bg-dark
                        flex items-center justify-center relative overflow-hidden"
                >
                <div
                    className="flex transition-transform duration-500 ease-in-out items-center w-full"
                    style={{
                    transform: `translateX(-${currentImgIndex * 100}%)`,
                    width: `${post.images.length * 100}%`,
                    }}
                >
                    {post.images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-auto md:h-full object-contain md:object-cover flex-shrink-0"
                    />
                    ))}
                </div>

                {/* Indicators */}
                <div className="absolute bottom-2 w-full flex justify-center gap-2">
                    {post.images.length > 1 &&
                    post.images.map((_, index) => (
                        <div
                        key={index}
                        onClick={() => setCurrentImgIndex(index)}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200
                                                                        ${
                                                                        index ===
                                                                        currentImgIndex
                                                                            ? "bg-white scale-110"
                                                                            : "bg-gray-400/50"
                                                                        }`}
                        />
                    ))}
                </div>

                {/* Prev / Next buttons */}
                {post.images.length > 1 && currentImgIndex > 0 && (
                    <button
                    onClick={() => setCurrentImgIndex((prev) => prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-dark-button/50 cursor-pointer text-white rounded-full hover:bg-opacity-70"
                    title="Previous"
                    >
                    <HiChevronLeft size={24} />
                    </button>
                )}
                {post.images.length > 1 &&
                    currentImgIndex < post.images.length - 1 && (
                    <button
                        onClick={() => setCurrentImgIndex((prev) => prev + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-dark-button/50 cursor-pointer text-white rounded-full hover:bg-opacity-70"
                        title="Next"
                    >
                        <HiChevronRight size={24} />
                    </button>
                    )}
                </div>
            )}

            <button
                onClick={handleEdit}
                disabled={editLoading}
                className="w-fit h-fit text-lg py-2 px-4 order-3 ml-auto
                                md:absolute md:bottom-4 md:right-4 cursor-pointer
                                bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4]
                                text-white shadow-lg
                                hover:scale-105 hover:shadow-2xl hover:font-semibold
                                transition-all duration-300 ease-in-out"
                title="Edit your post"
            >
                {editLoading ? "Updating..." : "Confirm"}
            </button>
            </div>
        </motion.div>
        </div>
    );
};

export default EditPostModal;
