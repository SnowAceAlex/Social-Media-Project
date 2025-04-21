import React, { useState } from "react";

import Avatar_Username from "./Avatar_Username";
import PostCaption from "./PostCaption";
import CommentModal from "./Modal/CommentModal";
import PostReaction from "./PostReaction";
import { getCurrentUser } from "../helpers/getCurrentUser";
import { BsThreeDots } from "react-icons/bs";
import PostOptionModal from "./Modal/PostOptionModal";
import usePostService from "../hook/usePostService";
import ConfirmModal from "./Modal/ConfirmModal";
import EditPostModal from "./Modal/EditPostModal";

function Post({post = null, profile = null, loading = false}) {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showPostOptions, setShowPostOptions] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showEditPost, setShowEditPost] = useState(false);

    const {currentUser} = getCurrentUser();
    const isCurrentUser = currentUser && currentUser.user?.id === post?.user_id;
    const { deletePost, loading: deleteLoading } = usePostService();
    const handleDeletePost = async () => {
        try {
            await deletePost(post.id);
            window.location.reload(); 
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    };

    return <div className="h-fit w-full px-4 pt-4 flex flex-col dark:text-dark-text">
            <div className="w-full h-[10%] flex items-center gap-4 pl-2 mb-2 relative">
                <Avatar_Username profile={profile} loading={loading} createdAt={post.created_at}/>
                {
                    isCurrentUser && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2" title="More options"
                                onClick={() => setShowPostOptions(true)}>
                            <BsThreeDots
                                size={18}
                                className="text-light-text dark:text-dark-text cursor-pointer"/>
                        </div>
                    )
                }
            </div>
            <PostCaption caption={post.caption}/>
            <PostReaction setShowCommentModal={setShowCommentModal}/>
            {/* COMMENTS MODAL */}
            {
                showCommentModal && (
                    <CommentModal 
                    profile={profile}
                    loading={loading}
                    post={post}
                    onClose={() => setShowCommentModal(false)}/>
                )
            }
            {/* POST OPTIONS MODAL */}
            {
                showPostOptions && (
                    <PostOptionModal 
                    onClose={() => setShowPostOptions(false)}
                    onDelete={() => {
                        setShowPostOptions(false);
                        setShowConfirmDelete(true);
                    }}
                    onEdit={() => {
                        setShowPostOptions(false);
                        setShowEditPost(true);
                    }}
                    />
                )
            }
            {/* CONFIRM DELETE MODAL */}
            {
                showConfirmDelete && (
                    <ConfirmModal
                        title={"Delete Post?"}
                        content={"Are you sure you want to delete this post?"}
                        confirm={"Delete"}
                        onConfirm={() => {
                            setShowConfirmDelete(false);
                            handleDeletePost();
                        }}
                        onCancel={() => setShowConfirmDelete(false)}
                    />
                )
            }
            {/* EDIT POST MODAL */}
            {
                showEditPost && (
                    <EditPostModal 
                    profile={profile}
                    loading={loading}
                    post={post}
                    onClose={() => setShowEditPost(false)}
                    />
                )
            }
        </div>
    ;
}

export default Post
