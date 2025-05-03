import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useMediaQuery from '../../hook/useMediaQuery';
import SearchLoading from '../Skeleton/SearchLoading';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import CommentModal from '../Modal/CommentModal';
import { getProfile } from '../../services/authService';
import { getSinglePostService } from '../../services/PostService';

function NotificationFrame({ showNotificationFrame }) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const {fetchNotificationHistory, notificationHistory, loading, error, hasMore, loadMore, loadingMore } = useNotifications();
    const observer = useRef();
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [profile, setProfile] = useState(null);
    const [post, setPost] = useState(null);
    const [loadingPost, setLoadingPost] = useState(false);

    useEffect(() => {
        if (showNotificationFrame) {
            fetchNotificationHistory(1); 
        }
    }, [showNotificationFrame, fetchNotificationHistory]);

    const lastNotificationRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadMore]);


    const handleNotificationClick = async (notification) => {
        if (!notification.post_id) {
            console.error("Notification does not contain a post ID");
            return;
        }
    
        setLoadingPost(true);
        try {
            const [profileData, postRes] = await Promise.all([
                getProfile(notification.user_id),
                getSinglePostService(notification.post_id)
            ]);
    
            console.log(postRes);
            setProfile(profileData);
            setPost(postRes.post);
            setShowCommentModal(true);
        } catch (error) {
            console.error("Failed to fetch profile or post:", error);
        } finally {
            setLoadingPost(false);
        }
    };    

    const reactionEmoji = (type) => {
        switch (type) {
            case "haha":
                return "😂";
            case "like":
                return "❤️";
            case "wow":
                return "😮";
            case "cry":
                return "😢";
            case "angry":
                return "😡";
            default:
                return "";
        }
    };

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
                                dark:border-dark-border py-6 overflow-y-auto scrollbar-hidden"
                                >
                        <h1 className="text-2xl font-bold mb-6 ml-8 dark:text-dark-text">
                            Notification
                        </h1>

                        {/* NOTIFICATION LIST */}
                        {Array.isArray(notificationHistory) && notificationHistory.map((notification, index) => (
                            <div
                                key={notification.id}
                                ref={notificationHistory.length === index + 1 ? lastNotificationRef : null}
                                className="pl-8 py-3 text-sm dark:text-white hover:bg-light-hover dark:hover:bg-dark-card/50 cursor-pointer"
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex gap-4 items-center">
                                    <Link to={`/profile/${notification.from_user_id}`}>
                                        <img
                                            src={notification.profile_pic_url}
                                            title={`to ${notification.username} profile`}
                                            alt="profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </Link>
                                    <div className="flex-1 flex flex-col gap-1 text-md">
                                        <span>
                                            <span className="font-semibold">{notification.username}</span>{" "}
                                            <span>
                                                {notification.type === "follow" && "started following you!"}
                                                {notification.type === "comment" && "just commented on your post!"}
                                                {notification.type !== "follow" && notification.type !== "comment" && (
                                                    <>reacted {reactionEmoji(notification.type)} on your post</>
                                                )}
                                            </span>
                                        </span>
                                        <span className='dark:text-dark-input-disabled-text text-light-input-disabled-text text-[0.75rem]'>
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(loading || loadingMore) && (
                            <div className="py-4">
                                <SearchLoading />
                            </div>
                        )}

                        {!hasMore && !loading && (
                            <p className="text-center text-gray-400 mt-4">No more notifications</p>
                        )}

                        {error && (
                            <p className="text-center text-red-500 mt-4">Error loading notifications</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {
                showCommentModal && (
                    <CommentModal 
                    profile={profile}
                    loading={loadingPost}
                    post={post}
                    onClose={() => {setShowCommentModal(false)}}/>
                )
            }
        </div>
    );
}

export default NotificationFrame;
