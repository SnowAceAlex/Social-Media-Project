import React, { useEffect, useRef, useState } from 'react';
import { TfiComment } from "react-icons/tfi";
import { CiBookmark } from "react-icons/ci";
import { CiShare1 } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { CiHeart } from "react-icons/ci";
import { useReactions } from '../hook/useReaction';
import ReactUserList from './Modal/ReactUserList';
import useDelayedHover from '../hook/Helper/useDelayHover';

function PostReaction({
        sortedReactions, 
        commentCount, 
        shareCount,
        setShowUserReactModal,
        setShowCommentModal, 
        reactions, 
        myReaction,
        handleReact, 
        reactUsers,
        fetchSavePost,
        setShowShareModal,
        fetchUnSavePost,
        isSaved}) {
    const [bookmarked, setBookmarked] = useState(false);
    const {
        isHovering: isEmojiHovering,
        handleMouseEnter: handleEmojiEnter,
        handleMouseLeave: handleEmojiLeave,
        setIsHovering: setIsEmojiHovering
    } = useDelayedHover(400);
    
    const {
        isHovering: showUserReact,
        handleMouseEnter: handleUserEnter,
        handleMouseLeave: handleUserLeave,
        setIsHovering: setShowUserReact
    } = useDelayedHover(400);
    
    const userReactRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userReactRef.current && !userReactRef.current.contains(event.target)) {
                setShowUserReact(false);
            }
        }
    
        if (showUserReact) {
            document.addEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showUserReact]); 
    useEffect(() => {
        if(isSaved) setBookmarked(true)
            else setBookmarked(false)
    }, [isSaved])

    const handleBookmark =() => {
        if (!bookmarked) {
            fetchSavePost();
        } else {
            fetchUnSavePost();
        }
        setBookmarked(!bookmarked);
    }

    return (
    <div className="h-12 flex justify-between items-center">
        <div className='flex gap-2 items-center relative'>
            <div
                className="flex gap-2 items-center relative"
                onMouseEnter={handleEmojiEnter}
                onMouseLeave={handleEmojiLeave}
            >
                {/* Nút cảm xúc */}
                <span
                    className="flex items-center hover:cursor-pointer hover:bg-gray-200 
                    px-2 py-1 rounded-full dark:hover:bg-dark-hover"
                    onClick={() => setIsHovering(true)} 
                    >
                    {sortedReactions.length === 0 ? (
                        <CiHeart size={22} className="text-[#E1306C]" title="React" />
                    ) : (
                        sortedReactions.map((emoji, i) => (
                            <span key={i} className="text-xl">{emoji}</span>
                        ))
                    )}
                </span>
                {/* Popup cảm xúc */}
                <AnimatePresence>
                    {isEmojiHovering && (
                        <motion.div
                            className="absolute bottom-[70%] left-0 mb-2 px-2 py-1 
                                    bg-white rounded-full shadow-xl
                                    cursor-pointer
                                    flex items-center text-2xl
                                    dark:bg-dark dark:text-white"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {[
                                { emoji: "❤️", type: "like" },
                                { emoji: "😂", type: "haha" },
                                { emoji: "😮", type: "wow" },
                                { emoji: "😢", type: "cry" },
                                { emoji: "😡", type: "angry" }
                            ].map(({ emoji, type }) => (
                                <motion.span
                                    key={type}
                                    title={type}
                                    whileHover={{
                                        scale: 1.5,
                                        transition: { type: "spring", stiffness: 300, damping: 10 },
                                    }}
                                    whileTap={{ scale: 1.2 }}
                                    animate={{ scale: myReaction === type ? 1.5 : 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                                    className="mx-1"
                                    onClick={() => {
                                        handleReact(type);
                                        setIsEmojiHovering(false);
                                    }}>
                                    {emoji}
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div
                className="relative inline-block"
                onMouseEnter={handleUserEnter}
                onMouseLeave={handleUserLeave}
                onClick={() => setShowUserReactModal(true)}
                ref={userReactRef}
            >
                <span className="dark:text-dark-text hover:underline cursor-pointer">
                    {Object.values(reactions).reduce((a, b) => a + b, 0)}
                </span>

                {showUserReact && Array.isArray(reactUsers.reactions) && (
                    <div className="absolute top-full left-0 z-50">
                        <ReactUserList reactUsers={reactUsers.reactions} />
                    </div>
                )}
            </div>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1 cursor-pointer hover:text-black
                            dark:text-dark-text-subtle dark:hover:text-dark-text"
                onClick={() => setShowCommentModal(true)}>
                <TfiComment size={18} className="mt-1" title="Comments"/>
                <span>{commentCount || 0}</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-black
                            dark:text-dark-text-subtle dark:hover:text-dark-text"
                onClick={() => setShowShareModal(true)}>
                <CiShare1 size={19} className="mt-1" title="Share"/>
                <span>{shareCount}</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-black
                            dark:text-dark-text-subtle dark:hover:text-dark-text"
                onClick={() => handleBookmark()}>
                <motion.div
                    key={bookmarked ? "saved" : "unsaved"}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {bookmarked ? (
                        <IoBookmark size={20} className="mt-0.5 text-[#E1306C]" title="Book Mark"/>
                    ) : (
                        <CiBookmark size={20} className="mt-0.5" title="Book Mark" />
                    )}
                </motion.div>
            </div>
        </div>
    </div>
    )
}

export default PostReaction
