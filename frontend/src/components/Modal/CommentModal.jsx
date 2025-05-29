import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import UploadBlock from "../UploadBlock";
import Avatar_Username from "../Avatar_Username";
import PostReaction from "../PostReaction";
import TextareaAutosize from "react-textarea-autosize";
import { formatDistanceToNow } from "date-fns";
import { IoMdSend } from "react-icons/io";
import { Link, useOutletContext } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { getCurrentUser } from "../../helpers/getCurrentUser";
import CommentOptionModal from "./CommentOptionModal";
import ConfirmModal from "./ConfirmModal";
import usePostService from "../../hook/usePostService";
import { useReactions } from "../../hook/useReaction";
import { motion } from "framer-motion";
import ReactUserModal from "./ReactUserModal";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import PostCaption from "../PostCaption";
import useComments from "../../hook/useComments";
import SharedPostCard from "../PostComponents/SharedPostCard";
import SharePostModal from "./SharePostModal";
import { useSelector } from "react-redux";

function CommentModal({ post, profile, loading, onClose }) {
    const [showCommentOptions, setShowCommentOptions] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showUserReactModal, setShowUserReactModal] = useState(false);
    const currentUser = useSelector(state => state.user.currentUser);
    const [content, setContent] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    
    const {
        comments,
        loading: loadingComments,
        addComment,
        refreshComments,
        deleteComment,
    } = useComments(post?.id)
    const { 
        commentCount,
        shareCount, 
        refreshCommentCount, 
        refreshShareCount, 
        fetchSavePost,
        fetchUnSavePost
    } = usePostService(post.id);

    //REACTION
    const {
        sortedReactions,
        reactions,
        reactUsers,
        refresh,
        react: handleReact,
        myReaction,
    } = useReactions(post.id);

    const handleSubmit = async () => {
        if (content.trim()) {
        await addComment(content);
        setContent("");
        await refreshComments();
        refreshCommentCount();
        }
    };
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    useEffect(() => {
        setCurrentImgIndex(0);
    }, [post.id]);

    return (
        <div
        className="fixed top-0 left-0 w-full h-full z-[99] bg-black/50
                    flex items-center justify-center dark:text-dark-text"
        >
        <IoCloseOutline
            size={45}
            onClick={onClose}
            title="Close"
            className="p-1 dark:text-dark-text text-light
                        rounded-full cursor-pointer hidden md:flex
                        absolute right-6 top-4 z-10"
        />
        <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`bg-white dark:bg-dark
                        ${
                            (post.images && post.images.length > 0) ? 
                            "w-[35rem] sm:w-[40rem] md:w-[50rem] lg:w-[60rem] xl:w-[70rem]" :
                            "w-[30rem] md:w-[35rem]"
                        }
                        max-h-[95vh] overflow-x-hidden shadow-md relative`}
        >
            {/* Responsive Content */}
            <div className="flex flex-col md:flex-row gap-6 px-4 py-6 md:h-[95vh] md:p-0">
            {/* Caption block - order first on mobile, second on desktop */}
                <div className="order-1 md:order-2 w-full md:flex-3">
                    {/* Header (mobile only) */}
                    <div className="relative flex items-center justify-center pb-4 md:p-4 border-b border-light-border dark:border-dark-border">
                    <span className="text-xl font-semibold text-center">
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
                    <div className={`w-full flex items-center gap-4 md:mb-2
                                    ${
                                        (post.images && post.images.length > 0) ? 
                                        "py-4 pl-2" : "pl-6 py-4"
                                    }`}>
                    <Avatar_Username
                        profile={profile}
                        loading={loading}
                        createdAt={post.created_at}
                    />
                    </div>
                </div>

                {/* Image block - order second on mobile, first on desktop */}
                {post.images?.length > 0 && (
                    <div
                    className="order-2 md:order-1 w-full md:flex-4 md:aspect-auto bg-dark
                                flex items-center justify-center relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out items-center w-full"
                        style={{
                        transform: `translateX(-${currentImgIndex * 100}%)`,
                        width: `${post.images.length * 100}%`,
                        }}
                    >
                        {post.images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-auto md:h-full object-contain md:object-cover flex-shrink-0"
                        />
                        ))}
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-2 w-full flex justify-center gap-2">
                        { post.images.length > 1 && post.images.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentImgIndex(index)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200
                                                ${
                                                    index === currentImgIndex
                                                    ? "bg-white scale-110"
                                                    : "bg-gray-400/50"
                                                }`}
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
                    {post.images.length > 1 &&
                        currentImgIndex < post.images.length - 1 && (
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
                {/*CONTENT*/}
                <div
                    className={`order-3 md:absolute flex flex-col
                                ${
                                    (post.images && post.images.length > 0) ?
                                    "md:top-32 md:right-4 lg:right-8 xl:right-6 md:ml-3 md:w-[20rem] lg:w-[23rem] xl:w-[28rem] md:h-12/15" 
                                    : "md:top-32 md:right-6 md:ml-3 md:w-[32rem] md:h-12/15"
                                }`}
                >
                    {/* Comment list scrollable */}
                    <div className="flex-1 overflow-auto">
                        <span className="text-base leading-relaxed block mb-4 border-b border-light-border dark:border-dark-border">
                            <PostCaption caption={post.caption}/>
                            {
                                post.shared_post_id && 
                                    <SharedPostCard 
                                        originalPost_id={post.shared_post_id}/>
                            }
                        </span>

                        <div className="flex flex-col gap-2 mb-6">
                            {loadingComments ? (
                            <div>Loading comments...</div>
                            ) : (
                            comments.map((user) => (
                                <div
                                key={user.id}
                                className="p-2 rounded dark:text-white flex gap-4 text-md group"
                                >
                                {user.profile_pic_url && (
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
                                )}
                                <div className="flex gap-1 flex-col">
                                    <span>
                                    <Link
                                        to={`/profile/${user.user_id}`}
                                        className="font-semibold cursor-pointer text-nowrap mr-2"
                                        title={user.username}
                                    >
                                        {user.username}
                                    </Link>
                                    {user.content}
                                    </span>
                                    <div className=" dark:text-dark-input-disabled-text text-light-input-disabled-text text-[0.8rem] flex gap-4 items-center">
                                    {user.created_at &&
                                        formatDistanceToNow(new Date(user.created_at), {
                                        addSuffix: true,
                                        })}
                                    {currentUser?.id === user.user_id && (
                                        <BsThreeDots
                                        size={18}
                                        className="hidden cursor-pointer group-hover:block"
                                        title="More options"
                                        onClick={() => {
                                            setShowCommentOptions(true),
                                            setCommentToDelete(user.id);
                                        }}
                                        />
                                    )}
                                    </div>
                                </div>
                                </div>
                            ))
                            )}
                        </div>
                    </div>

                    {/* Fixed input area always visible */}
                    <div className="md:sticky bottom-0 bg-white dark:bg-dark">
                    <PostReaction
                        commentCount={commentCount}
                        shareCount={shareCount}
                        setShowUserReactModal={setShowUserReactModal}
                        sortedReactions={sortedReactions}
                        reactions={reactions}
                        myReaction={myReaction}
                        handleReact={handleReact}
                        reactUsers={reactUsers}
                        fetchSavePost={() => fetchSavePost(post.id)}
                        fetchUnSavePost={() => fetchUnSavePost(post.id)}
                        setShowShareModal={setShowShareModal}
                        isSaved={post.is_saved}
                    />

                    <div className="flex items-center border border-transparent focus-within:border-black 
                                    dark:focus-within:border-dark-button-hover rounded-md overflow-hidden">
                        <TextareaAutosize
                        minRows={1}
                        maxRows={3}
                        className="flex-1 p-2 resize-none outline-none"
                        placeholder="Type your comment..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
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
                        <IoMdSend
                            size={18}
                            className="text-dark dark:text-white group-hover:text-theme"
                        />
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </motion.div>
        {showCommentOptions && (
            <CommentOptionModal
            onClose={() => setShowCommentOptions(false)}
            onDelete={() => {
                setShowConfirmModal(true);
                setShowCommentOptions(false);
            }}
            />
        )}
        {showConfirmModal && (
            <ConfirmModal
            title="Delete Comment"
            content="Are you sure you want to delete this comment?"
            confirm="Delete"
            onConfirm={async () => {
                try {
                await deleteComment(commentToDelete);
                await refreshCommentCount();
                } catch (error) {
                } finally {
                setShowConfirmModal(false);
                setCommentToDelete(null);
                }
            }}
            onCancel={() => {
                setShowConfirmModal(false);
            }}
            />
        )}
        {/* USERS REACTION MODAL */}
        {showUserReactModal && (
            <ReactUserModal
            reactUsers={reactUsers.reactions}
            onClose={() => setShowUserReactModal(false)}
            />
        )}
         {/* SHARE POST MODAL */}
        {
                showShareModal && (
                    <SharePostModal
                    post={post}
                    loading={loading}
                    profile={profile}
                    onClose={()=>{setShowShareModal(false), refreshShareCount()}}/>
                )
        }
        </div>
    );
}

export default CommentModal;
