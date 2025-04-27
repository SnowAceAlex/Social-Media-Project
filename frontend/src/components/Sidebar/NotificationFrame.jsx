import React, { useState } from 'react';
import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import useMediaQuery from '../../hook/useMediaQuery';
import useUserSearch from '../../hook/useUserSearch';
import SearchLoading from '../Skeleton/SearchLoading';
import SearchCard from '../SearchCard';

function NotificationFrame({ showNotificationFrame}) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
    <div>
        <AnimatePresence> 
            {showNotificationFrame && isDesktop && (
            <motion.div
                key="notification-frame"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{
                duration: 0.3,
                ease: "easeOut",
                exit: { duration: 0.2, ease: "easeIn" }
                }}
                className="fixed top-0 left-20 h-screen w-96 rounded-4xl
                        bg-light dark:bg-dark z-40 border-r-1 border-light-border
                        dark:border-dark-border px-8 py-6">
                    <h1 className="text-2xl font-bold mb-12 dark:text-dark-text">Notification</h1>
                    <div className="relative w-full">
            
                    </div>

            </motion.div>
            )}
        </AnimatePresence>
    </div>
    );
}

export default NotificationFrame
