import React from "react";
import { motion } from "framer-motion";

function CommentOptionModal({ onClose, onDelete }) {
    return (
        <div className="fixed inset-0 z-[99] bg-black/50 flex items-center justify-center dark:text-dark-text">
            <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white dark:bg-dark-card w-[20rem] rounded-xl overflow-auto flex flex-col shadow-md"
            >
                <div
                    className="h-14 flex items-center justify-center px-4 border-b-[1px] cursor-pointer
                                border-light-border dark:border-gray-500/50 hover:bg-light-button-hover 
                                dark:hover:bg-dark-button-hover dark:text-white"
                    onClick={onDelete}
                >
                    Delete comment
                </div>
                <div
                    className="h-14 flex items-center justify-center px-4 cursor-pointer
                            border-light-border hover:bg-light-button-hover 
                            dark:hover:bg-dark-button-hover dark:text-white"
                    onClick={onClose}
                >
                    Cancel
                </div>
            </motion.div>
        </div>
    );
}

export default CommentOptionModal;