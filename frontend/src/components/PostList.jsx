import React from "react";
import useInfinitePosts from "../hook/useFetchPost";
import Post from "./Post";
import { getCurrentUser } from "../helpers/getCurrentUser";
import { CiCamera } from "react-icons/ci";

function PostList({ profile = null, loadingProfile = false, userId = null, reloadPosts = false }) {
    const {currentUser} = getCurrentUser();
    const { posts, loading, lastPostRef } = useInfinitePosts(userId, reloadPosts);

    return (
        <div className="flex flex-col w-full">
            {!loading && posts.length === 0 && (
                <div className="mt-4 text-gray-500 dark:text-gray-400 py-8 flex items-center justify-center flex-col gap-6">
                    <div className="p-4 rounded-full text-gray-500 dark:text-gray-400 border-2 border-gray-500 dark:border-gray-400 flex justify-center items-center">
                        <CiCamera size={40} />
                    </div>

                    {           
                        currentUser?.user?.id === userId ? 
                        "No posts yet — start sharing your thoughts!" : 
                        "Looks like they haven’t shared any posts."
                    }
                </div>
            )}

            {posts.map((post, index) => {
                const isLast = index === posts.length - 1;
                return (
                    <div
                        key={post.id}
                        ref={isLast ? lastPostRef : null}
                        className="py-2 border-b-[1px] border-light-border dark:border-dark-border"
                    >
                    <Post post={post} profile={profile} loading={loadingProfile} />
                    </div>
                );
            })}
    
            {loading && (
            <div
                className="h-[42rem] w-full pt-4 flex flex-col"
            >
                <div className="w-full h-[10%] flex items-center px-4 gap-4">
                <div className="w-14 aspect-square rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="w-52 md:w-60 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
                <div className="px-4 py-2 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
            )}
        </div>
    );
}

export default PostList;