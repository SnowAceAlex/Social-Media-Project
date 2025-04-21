import React, { useEffect, useRef, useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import UploadBlock from '../UploadBlock';
import Avatar_Username from '../Avatar_Username';
import PostReaction from '../PostReaction';
import TextareaAutosize from 'react-textarea-autosize';
import useComments from '../../hook/useComments';
import { formatDistanceToNow } from 'date-fns';
import { IoMdSend } from "react-icons/io";
import { Link, useOutletContext } from 'react-router-dom';
import { BsThreeDots } from "react-icons/bs";
import { getCurrentUser } from '../../helpers/getCurrentUser';
import CommentOptionModal from './CommentOptionModal';
import ConfirmModal from './ConfirmModal';
import usePostService from '../../hook/usePostService';
import { useReactions } from '../../hook/useReaction';

function CommentModal({post, profile, loading, onClose }) {
    const captionRef = useRef(null);
    const {currentUser} = getCurrentUser();
    const [content, setContent] = useState("");
    const { comments, loading: loadingComments, addComment, refreshComments, deleteComment} = useComments(post?.id);
    const [ showCommentOptions, setShowCommentOptions ] = useState(false);      
    const [commentToDelete, setCommentToDelete] = useState(null);
    const { showGlobalToast } = useOutletContext();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const {commentCount, refreshCommentCount} = usePostService(post.id);
    
    //REACTION
    const {
        sortedReactions,
        reactions,
        refresh,
        react: handleReact,
        myReaction
    } = useReactions(post.id);

    const handleSubmit = async () => {
        if (content.trim()) {
            await addComment(content);
            setContent("");
            await refreshComments();
            refreshCommentCount(); 
        }
    };

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
            <div className="bg-white dark:bg-dark-card w-[30rem] md:w-[50rem] lg:w-[60rem] xl:w-[70rem]
                            max-h-[90vh] overflow-hidden shadow-md relative">
                {/* Responsive Content */}
                <div className="flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-auto px-4 py-6 md:h-[90vh]
                                md:p-0">
                    {/* Caption block - order first on mobile, second on desktop */}
                    <div className="order-1 md:order-2 w-full md:flex-3">
                        {/* Header (mobile only) */}
                        <div className="relative flex items-center justify-center pb-4 md:p-4 border-b border-light-border dark:border-dark-border">
                            <span className='text-xl font-semibold text-center'>
                                Post of {profile?.username}
                            </span>
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
                        <div className="w-full flex items-center gap-4 mt-2 md:mb-2">
                            <Avatar_Username profile={profile} loading={loading} createdAt={post.created_at}/>
                        </div>
                    </div>

                    {/* Upload block - order second on mobile, first on desktop */}
                    <UploadBlock/>
                    {/* */}
                    <div
                        className="order-3 md:absolute md:top-36 md:right-10 lg:right-8 xl:right-4 md:ml-3 
                                    md:w-[18rem] lg:w-[23rem] xl:w-[28rem] md:h-[36rem] 
                                    flex flex-col">
                        
                        {/* Comment list scrollable */}
                        <div className="flex-1 overflow-auto pr-1">
                            <span className="text-base leading-relaxed block pb-6 mb-4 border-b border-light-border dark:border-dark-border">
                            {post?.caption}
                            </span>

                            <div className='flex flex-col gap-2 mb-6'>
                                {loadingComments ? (
                                    <div>Loading comments...</div>
                                ) : (
                                    comments.map((user) => (
                                    <div key={user.id} className='p-2 rounded dark:text-white flex gap-4 text-md group'>
                                        {
                                            user.profile_pic_url && (
                                                <Link to={`/profile/${user.user_id}`}>
                                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                                        <img
                                                            src={user.profile_pic_url}
                                                            title={user.username}
                                                            alt={user.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                            )
                                        }
                                        <div className='flex gap-1 flex-col'>
                                            <span>
                                                <Link 
                                                    to={`/profile/${user.user_id}`} 
                                                    className='font-semibold cursor-pointer text-nowrap mr-2'
                                                    title={user.username}>
                                                    {user.username}
                                                </Link>
                                                {user.content}
                                            </span>
                                            <div className=" dark:text-dark-input-disabled-text text-light-input-disabled-text text-[0.8rem] flex gap-4 items-center">
                                                {user.created_at && formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                                {
                                                    currentUser?.user?.id === user.user_id && (
                                                        <BsThreeDots size={18} className="hidden cursor-pointer group-hover:block" title='More options' 
                                                                    onClick={() =>{ 
                                                                        setShowCommentOptions(true),
                                                                        setCommentToDelete(user.id);}}/>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Fixed input area always visible */}
                        <div className="md:sticky bottom-0 bg-white dark:bg-dark-card">
                            <PostReaction 
                                commentCount={commentCount}
                                sortedReactions={sortedReactions}
                                reactions={reactions}
                                myReaction={myReaction}
                                handleReact={handleReact}/>
                            <div className="flex items-center border rounded-md overflow-hidden">
                            <TextareaAutosize
                                minRows={1}
                                maxRows={3}
                                className="flex-1 p-2 resize-none outline-none"
                                placeholder="Type your comment..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                                }}
                            />
                            <button
                                onClick={handleSubmit}
                                className="p-2 flex items-center justify-center cursor-pointer group active:scale-110"
                                title="Send"
                            >
                                <IoMdSend size={18} className="text-dark dark:text-white group-hover:text-theme" />
                            </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {
                showCommentOptions && (
                    <CommentOptionModal 
                        onClose={() => setShowCommentOptions(false)}
                        onDelete={() => {
                            setShowConfirmModal(true);
                            setShowCommentOptions(false);
                        }} />
                )
            }
            {
                showConfirmModal && (
                    <ConfirmModal
                        title="Delete Comment"
                        content="Are you sure you want to delete this comment?"
                        confirm="Delete"
                        onConfirm={async () => {
                            try {
                                await deleteComment(commentToDelete);
                                await refreshCommentCount();
                                showGlobalToast("Comment deleted successfully", "success");
                            } catch (error) {
                                showGlobalToast("Failed to delete comment", "error");
                            } finally {
                                setShowConfirmModal(false);
                                setCommentToDelete(null);
                            }
                        }}
                        onCancel={() => {
                            setShowConfirmModal(false);
                        }}
                    />
                )
            }
        </div>
    );
}

export default CommentModal;
