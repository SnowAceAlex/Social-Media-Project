import React from 'react';
import { motion } from 'framer-motion'; 
import { Link } from "react-router-dom";

function ConfirmModal({ title, content, confirm, to, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
            <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-white dark:bg-dark-card rounded-xl w-[22rem] text-center dark:text-dark-text overflow-hidden shadow-lg"
            >
                <div className='w-full py-6 px-4'>
                    <h2 className="text-xl mb-4">{title}</h2>
                    <p>{content}</p>
                </div>
                <div className="flex flex-col justify-around w-full border-t border-light-border dark:border-gray-500/30">
                    {to ? (
                        <Link
                            to={to}
                            onClick={onConfirm}
                            className="cursor-pointer h-12 flex items-center justify-center text-red-500 font-semibold dark:hover:bg-dark-hover"
                        >
                            {confirm}
                        </Link>
                    ) : (
                        <button
                            onClick={onConfirm}
                            className="cursor-pointer h-12 px-6 py-3 text-red-500 font-semibold dark:hover:bg-dark-hover"
                        >
                            {confirm}
                        </button>   
                    )}
                    <button
                        onClick={onCancel}
                        className="cursor-pointer border-t border-light-border dark:border-gray-500/30 h-12 px-4 py-2 dark:hover:bg-dark-hover"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default ConfirmModal;