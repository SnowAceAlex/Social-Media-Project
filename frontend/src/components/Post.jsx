import React, { useEffect, useState } from "react";

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
import { useReactions } from "../hook/useReaction";
import ReactUserModal from "./Modal/ReactUserModal";
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

function Post({post = null, profile = null, loading = false}) {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showPostOptions, setShowPostOptions] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showEditPost, setShowEditPost] = useState(false);
    const [showUserReactModal, setShowUserReactModal] = useState(false);

    const {currentUser} = getCurrentUser();
    const isCurrentUser = currentUser && currentUser.user?.id === post?.user_id;
    const {
        commentCount,
        fetchSavePost,
        fetchUnSavePost,
        refreshCommentCount,
        deletePost,
        loading: deleteLoading
    } = usePostService(post.id);

    //REACTION
    const {
        sortedReactions,
        reactions,
        reactUsers,
        refresh,
        react: handleReact,
        myReaction
    } = useReactions(post.id);

    // DELETE POST
    const handleDeletePost = async () => {
        try {
            await deletePost(post.id);
            window.location.reload(); 
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    };
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    useEffect(() => {
        setCurrentImgIndex(0);
    }, [post.id]);      

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
            {post.images?.length > 0 && (
            <div className="w-full relative mt-4 flex items-center justify-center overflow-hidden rounded-lg">
                {/* Slide wrapper */}
                <div className="flex transition-transform duration-500 ease-in-out"
                    style={{
                    transform: `translateX(-${currentImgIndex * 100}%)`,
                    width: `${post.images.length * 100}%`,
                }}>
                    {post.images.map((img, index) => (
                        <img
                        key={index}
                        src={img}
                        alt={`Post image ${index + 1}`}
                        className="w-full object-cover flex-shrink-0"
                        />
                    ))}
                </div>

                    {/* Indicators */}
                    <div className="absolute bottom-2 w-full flex justify-center gap-2">
                    {post.images.length > 1 && post.images.map((_, index) => (
                        <div
                        key={index}
                        onClick={() => setCurrentImgIndex(index)}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200
                            ${index === currentImgIndex ? "bg-white scale-110" : "bg-gray-400/50"}`}
                        />
                    ))}
                    </div>

                    {/* Prev / Next buttons */}
                    {post.images.length > 1 && currentImgIndex > 0 && (
                    <button
                        onClick={() => setCurrentImgIndex((prev) => prev - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-dark-button/50 cursor-pointer text-white rounded-full hover:bg-opacity-70"
                        title="Previous"
                    >
                        <HiChevronLeft size={24} />
                    </button>
                    )}
                    {post.images.length > 1 && currentImgIndex < post.images.length - 1 && (
                    <button
                        onClick={() => setCurrentImgIndex((prev) => prev + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-dark-button/50 cursor-pointer text-white rounded-full hover:bg-opacity-70"
                        title="Next"
                    >
                        <HiChevronRight size={24} />
                    </button>
                    )}
            </div>
            )}


            <PostReaction 
                commentCount={commentCount}
                setShowCommentModal={setShowCommentModal}
                setShowUserReactModal={setShowUserReactModal}
                sortedReactions={sortedReactions}
                reactions={reactions}
                myReaction={myReaction}
                handleReact={handleReact}
                reactUsers={reactUsers}
                fetchSavePost={() => fetchSavePost(post.id)}
                fetchUnSavePost={() => fetchUnSavePost(post.id)}
                />
            {/* COMMENTS MODAL */}
            {
                showCommentModal && (
                    <CommentModal 
                    profile={profile}
                    loading={loading}
                    post={post}
                    onClose={() => {setShowCommentModal(false), refresh(), refreshCommentCount()}}/>
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
            {/* USERS REACTION MODAL */}
            {
                showUserReactModal && (
                    <ReactUserModal
                    reactUsers={reactUsers.reactions}
                    onClose={() => setShowUserReactModal(false)}
                    />
                )
            }
        </div>
    ;
}

export default Post
