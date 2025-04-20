import React, { useState } from "react";

import Avatar_Username from "./Avatar_Username";
import PostCaption from "./PostCaption";
import CommentModal from "./Modal/CommentModal";
import PostReaction from "./PostReaction";

function Post({post = null, profile = null, loading = false}) {
    const [showCommentModal, setShowCommentModal] = useState(false);

    return <div className="h-fit w-full px-4 pt-4 flex flex-col dark:text-dark-text">
            <div className="w-full h-[10%] flex items-center gap-4 pl-2 mb-2">
                <Avatar_Username profile={profile} loading={loading} createdAt={post.created_at}/>
            </div>
            <PostCaption caption={post.caption}/>
            {/* <div className="flex-grow bg-gray-200 dark:bg-gray-700 my-4 rounded-xl animate-pulse" /> */}
            {/* <div className="h-12 mx-4 mb-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" /> */}
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
        </div>
    ;
}

export default Post
