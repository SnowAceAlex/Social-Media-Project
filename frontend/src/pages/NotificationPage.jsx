import React, { useRef, useCallback, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import SearchLoading from '../components/Skeleton/SearchLoading';
import { useNotifications } from '../contexts/NotificationContext';
import { getProfile } from '../services/authService';
import { getSinglePostService } from '../services/PostService';
import CommentModal from '../components/Modal/CommentModal';

function NotificationPage() {
    const {fetchNotificationHistory, notificationHistory, loading, error, hasMore, loadMore, loadingMore } = useNotifications();
    const observer = useRef();
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [profile, setProfile] = useState(null);
    const [post, setPost] = useState(null);
    const [loadingPost, setLoadingPost] = useState(false);

    useEffect(() => {
            fetchNotificationHistory(1); 
    }, [fetchNotificationHistory]);

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
        <div className="md:ml-9 lg:ml-0 flex flex-col items-center pb-18 -mt-12 md:mt-0 px-6">
            <div className='flex flex-col w-full md:w-[32rem] lg:w-[45rem]'>
                <span className='sticky top-16 md:top-0 bg-white dark:bg-dark z-[30] text-2xl dark:text-white p-6 mt-6 font-bold 
                                border-b-[1px] border-light-border dark:border-dark-border hidden md:block mb-4'>
                    Notification
                </span>
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
            </div>
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
    )
}

export default NotificationPage
