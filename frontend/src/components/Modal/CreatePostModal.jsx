import React, { useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import useProfile from '../../hook/useProfile';
import CaptionTextarea from '../CaptionTextarea';
import { LiaPhotoVideoSolid } from "react-icons/lia";
import UploadBlock from '../UploadBlock';

const CreatePostModal = ({ onClose }) => {
    const { profile, loading } = useProfile();
    const [caption, setCaption] = useState("");

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
                        <div className="flex gap-4 items-center mt-6 mb-4">
                            <div className="w-14 aspect-square rounded-full border-4 border-white overflow-hidden bg-gray-300 dark:border-dark">
                                {loading ? (
                                    <div className="w-full h-full bg-gray-300 animate-pulse"></div>
                                ) : (
                                    <img
                                        src={profile?.profile_pic_url}
                                        alt={profile?.username}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                {profile ? (
                                    <span className="text-lg font-medium dark:text-dark-text">{profile.username}</span>
                                ) : (
                                    <div className="w-32 h-4 bg-gray-300 rounded animate-pulse" />
                                )}
                            </div>
                        </div>

                        <CaptionTextarea value={caption} onChange={setCaption} />
                    </div>

                    {/* Upload block - order second on mobile, first on desktop */}
                    <UploadBlock/>
                </div>
            </div>
        </div>
    )
}

export default CreatePostModal;
