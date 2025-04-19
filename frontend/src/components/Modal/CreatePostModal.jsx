import React, { useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import useProfile from '../../hook/useProfile';
import CaptionTextarea from '../CaptionTextarea';
import { LiaPhotoVideoSolid } from "react-icons/lia";
import UploadBlock from '../UploadBlock';
import axios from 'axios';
import { useCreatePostService } from '../../hook/useCreatePostService';
import Avatar_Username from '../Avatar_Username';
import { getCurrentUser } from '../../helpers/getCurrentUser';

const CreatePostModal = ({ onClose }) => {
    const {currentUser} = getCurrentUser();
    const { profile, loading, error } = useProfile(currentUser?.user?.id);
    
    const [caption, setCaption] = useState("");
    
    const { handleCreatePost } = useCreatePostService(
        () => {
            alert("Post created!");
            onClose();
        },
        (errMsg) => {
            alert("Failed to create post: " + errMsg);
        }
    );

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
            <div className="bg-white dark:bg-dark-card w-[30rem] md:w-[50rem] lg:w-[60rem] xl:w-[65rem]
                            max-h-[90vh] overflow-hidden shadow-md relative">
                {/* Responsive Content */}
                <div className="flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-auto px-4 py-6 md:h-[80vh]
                                md:p-0">
                    {/* Caption block - order first on mobile, second on desktop */}
                    <div className="order-1 md:order-2 w-full md:w-1/2">
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
                        <div className="w-full h-[10%] flex items-center gap-4 mt-6 mb-6">
                            <Avatar_Username profile={profile} loading={loading}/>
                        </div>

                        <CaptionTextarea value={caption} onChange={setCaption} />
                    </div>

                    {/* Upload block - order second on mobile, first on desktop */}
                    <UploadBlock/>
                    <button
                        className="w-fit h-fit text-lg py-2 px-4 order-3 ml-auto
                            md:absolute md:bottom-4 md:right-4 cursor-pointer
                            bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4]
                            text-white shadow-lg
                            hover:scale-105 hover:shadow-2xl hover:font-semibold
                            transition-all duration-300 ease-in-out"
                        title='Create your post'
                        onClick={() => handleCreatePost(caption)}
                        >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreatePostModal;
