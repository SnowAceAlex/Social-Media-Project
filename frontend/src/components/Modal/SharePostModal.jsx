import React, { useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import Avatar_Username from '../Avatar_Username';
import useProfile from '../../hook/useProfile';
import { getCurrentUser } from '../../helpers/getCurrentUser';
import CaptionTextarea from '../CaptionTextarea';
import usePostService from '../../hook/usePostService';
import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SharePostModal({post, loading, onClose}) {
    const currentUser = useSelector(state => state.user.currentUser);
    const {profile, error } = useProfile(currentUser?.id);
    const [caption, setCaption] = useState("");
    const { fetchSharePost } = usePostService();
    const { showGlobalToast } = useOutletContext();

    const handleShare = async () => {
        try {
            await fetchSharePost(post.id, caption);
            showGlobalToast("Post shared – your friends can see it now.", "success");
            onClose();
        } catch (err) {
            console.error("Error sharing post:", err);
            showGlobalToast("Failed to share post.", "error");
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full z-[99] bg-black/50 flex items-center justify-center dark:text-dark-text">
            <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative bg-white dark:bg-dark-card p-6 w-[30rem] h-[62vh] max-h-[80vh] rounded-xl overflow-auto shadow-lg scrollbar-hidden"
            >
                {/* Header */}
                <div className="flex w-full items-center mb-4 relative">
                    <h2 className="text-xl font-bold dark:text-dark-text w-full text-center">Sharing</h2>
                    <IoCloseOutline
                        size={28}
                        onClick={onClose}
                        title="Close"
                        className="p-1 bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text rounded-full cursor-pointer absolute right-0 top-1/2 -translate-y-1/2"
                    />
                </div>
                {/* Avatar */}
                <div className={`w-full flex items-center gap-4 md:mb-2 py-4`}>
                <Avatar_Username
                    profile={profile}
                    loading={loading}
                    createdAt={post.created_at}
                />
                </div>
                
                <CaptionTextarea value={caption} onChange={setCaption} />
                
                <button
                onClick={() => handleShare()}
                className="bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4] 
                            text-white px-4 py-2 rounded 
                            hover:bg-light-button-hover cursor-pointer
                            absolute bottom-5 right-5"
                >
                    Share
                </button>
            </motion.div>
        </div>
    )
}

export default SharePostModal
