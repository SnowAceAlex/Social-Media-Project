import React, { useEffect, useState } from 'react'
import { getProfile } from '../../services/authService';
import { getSinglePostService } from '../../services/PostService';
import PostCaption from '../PostCaption';
import Avatar_Username from '../Avatar_Username';
import PostImagesCarousel from './PostImagesCarousel ';
import CommentModal from '../Modal/CommentModal';
import { useReactions } from '../../hook/useReaction';
import usePostService from '../../hook/usePostService';

function SharedPostCard({originalPost_id}) {
    const [profile, setProfile] = useState(null);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const {
            refresh,
            react: handleReact,
    } = useReactions(originalPost_id);
    const {
        refreshCommentCount,
    } = usePostService(originalPost_id);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const postData = await getSinglePostService(originalPost_id);
                setPost(postData.post);
    
                const profileData = await getProfile(postData.post.user_id);
                setProfile(profileData);
            } catch (err) {
                console.error("Failed to load shared post", err);
            } finally{
                setLoading(false);
            }
        };

        if (originalPost_id) {
            fetchData();
        }
    }, [originalPost_id]);

    if (!post || !profile) return null;
    return (
        <>
        <div className='w-full mb-6 cursor-pointer h-40 rounded-lg border-[1px] border-light-border/80 dark:border-dark-border/50 flex' 
            onClick={() => {setShowCommentModal(true)}}>
            <div className='flex-1 flex flex-col gap-4 p-4'>
                <Avatar_Username   profile={profile} createdAt={post.created_at}/>
                <span className={`truncate ${post.images?.length > 0 ? "max-w-[200px]" 
                    : "max-w-[25rem] md:max-w-[29rem]"}`}>
                    {post.caption}
                </span>
            </div>
            {post.images?.length > 0 && (
                <div className='flex-1'>
                    <img
                        src={post.images[0]}
                        alt="Post preview"
                        className="w-full h-full object-cover rounded"
                    />
                </div>
            )}
        </div>
           {/* COMMENTS MODAL */}
        {
            showCommentModal && (
                <CommentModal 
                profile={profile}
                post={post}
                onClose={() => {setShowCommentModal(false), refresh(), refreshCommentCount()}}/>
            )
        }
        </>
    )
}

export default SharedPostCard
