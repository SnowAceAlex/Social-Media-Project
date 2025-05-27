import React, { useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import useProfile from '../../hook/useProfile';
import CaptionTextarea from '../CaptionTextarea';
import UploadBlock from '../UploadBlock';
import { useCreatePostService } from '../../hook/useCreatePostService';
import Avatar_Username from '../Avatar_Username';
import { getCurrentUser } from '../../helpers/getCurrentUser';
import { motion } from 'framer-motion'; 
import { useUploadService } from '../../hook/useUploadService';

const CreatePostModal = ({ onClose, showGlobalToast, setShowLoading, onPostCreated}) => {
    const {currentUser} = getCurrentUser();

    const { profile, loading, error } = useProfile(currentUser?.user?.id);
    const [caption, setCaption] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const {uploadMultiple} = useUploadService();
    const { handleCreatePost } = useCreatePostService();

    const handleSubmitPost = async () => {
        try{
            setShowLoading(true);
            await handleCreatePost(caption, selectedFiles);

        }catch (err){
            console.error("Upload failed:", err);
            showGlobalToast("Upload failed", "error");
        } finally{
            setShowLoading(false);
            if (onPostCreated) onPostCreated();
            onClose();
            showGlobalToast("Post created!", "success");
        }
    }

    //HANDLE HASHTAGS
    const extractHashtags = (text) => {
        return (text.match(/#\w+/g) || []).map(tag => tag.slice(1).toLowerCase());
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full z-[99] bg-black/50
                        flex items-center justify-center dark:text-dark-text">
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
                className="bg-white dark:bg-dark-card w-[30rem] md:w-[50rem] lg:w-[60rem] xl:w-[70rem]
                            max-h-[90vh] overflow-hidden shadow-md relative">
                {/* Responsive Content */}
                <div className="flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-hidden px-4 py-6 md:h-[90vh]
                                md:p-0">
                    {/* Caption block - order first on mobile, second on desktop */}
                    <div className="order-1 md:order-2 w-full md:flex-3">
                        {/* Header (mobile only) */}
                        <div className="relative flex items-center justify-center p-4 border-b border-light-border dark:border-dark-border">
                            <span className='text-2xl font-bold text-center'>Create Post</span>
                            <IoCloseOutline 
                                size={28}
                                onClick={onClose} 
                                title="Close"
                                className="p-1 bg-light-button hover:bg-light-button-hover md:hidden
                                            dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text
                                            rounded-full cursor-pointer absolute right-0 top-0"
                            />
                        </div>

                        {/* Avatar */}
                        <div className="w-full h-[10%] flex items-center gap-4 my-4">
                            <Avatar_Username profile={profile} loading={loading}/>
                        </div>

                        <CaptionTextarea value={caption} onChange={setCaption} />
                    </div>

                    {/* Upload block - order second on mobile, first on desktop */}
                    <UploadBlock onFilesSelected={setSelectedFiles}/>
                    <button
                        className="w-fit h-fit text-lg py-2 px-4 order-3 ml-auto
                            md:absolute md:bottom-4 md:right-4 cursor-pointer
                            bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4]
                            text-white shadow-lg
                            hover:scale-105 hover:shadow-2xl hover:font-semibold
                            transition-all duration-300 ease-in-out"
                        title='Create your post'
                        onClick={handleSubmitPost}
                        >
                        Create
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default CreatePostModal;
