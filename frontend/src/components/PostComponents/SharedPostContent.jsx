import React, { useEffect, useState } from 'react'
import { getProfile } from '../../services/authService';
import { getSinglePostService } from '../../services/PostService';
import PostCaption from '../PostCaption';
import Avatar_Username from '../Avatar_Username';
import PostImagesCarousel from './PostImagesCarousel ';
import CommentModal from '../Modal/CommentModal';
import { useReactions } from '../../hook/useReaction';
import usePostService from '../../hook/usePostService';
import PostLoading from '../Skeleton/PostLoading';

function SharedPostContent({originalPost_id}) {
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

    if(loading){
        return(
            <div className={`w-full pb-2 border-[1px] flex flex-col gap-6 rounded-lg border-light-border dark:border-dark-border/50`}>
                <PostLoading/>
            </div>
        )
    }

    return (
        <div className={`w-full pb-2 border-[1px] flex flex-col gap-6 rounded-lg border-light-border dark:border-dark-border/50
            ${post.images?.length > 0 ? "" : "pt-4 px-2"}`}>
            {post.images?.length > 0 &&
                <PostImagesCarousel images={post.images} />
            }
            <div className='w-full flex flex-col px-2 gap-4'>
                <Avatar_Username 
                profile={profile} createdAt={post.created_at} setShowCommentModal={setShowCommentModal}/>
                <PostCaption caption={post.caption}/>
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
        </div>
    )
}

export default SharedPostContent
