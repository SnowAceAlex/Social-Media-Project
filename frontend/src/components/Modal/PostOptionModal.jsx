import React from 'react'

function PostOptionModal({onClose, onEdit, onDelete}) {
    return (
        <div className="fixed inset-0 z-[99] bg-black/50 flex items-center justify-center dark:text-dark-text">
            <div className="bg-white dark:bg-dark-card w-[20rem] rounded-xl overflow-auto flex flex-col">
                    <div
                        className="h-14 flex items-center justify-center px-4 border-b-[1px] cursor-pointer
                                    border-light-border dark:border-gray-500/50 hover:bg-light-button-hover 
                                    dark:hover:bg-dark-hover dark:text-white">
                        Edit post
                    </div>
                    <div
                        className="h-14 flex items-center justify-center px-4 border-b-[1px] cursor-pointer
                                    border-light-border dark:border-gray-500/50 hover:bg-light-button-hover 
                                    dark:hover:bg-dark-hover dark:text-white"
                        onClick={onDelete}>
                        Delete post
                    </div>
                    <div
                        className="h-14 flex items-center justify-center px-4 cursor-pointer
                                border-light-border hover:bg-light-button-hover 
                                dark:hover:bg-dark-hover dark:text-white"
                        onClick={onClose}>
                        Cancel
                    </div>
            </div>
        </div>
    );
}

export default PostOptionModal
