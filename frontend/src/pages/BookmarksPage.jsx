import React, { useCallback, useEffect, useRef } from 'react'
import usePostService from '../hook/usePostService';
import Post from '../components/Post';
import PostLoading from '../components/Skeleton/PostLoading';

function BookmarksPage() {
    const {
        savedPosts,
        fetchGetSavedPost,
        hasMoreSaved,
        savedPage,
        loading
    } = usePostService(undefined, { autoFetchCommentCount: false });

    useEffect(() => {
        fetchGetSavedPost(1);
    }, [fetchGetSavedPost]);

    const lastPostRef = useRef(null);

    const observer = useRef();
    const lastPostElementRef = useCallback(
    (node) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreSaved) {
            fetchGetSavedPost(savedPage + 1);
        }
        });

        if (node) observer.current.observe(node);
    },
    [loading, hasMoreSaved, savedPage, fetchGetSavedPost]
    );


    return (
        <div className="md:ml-9 lg:ml-0 flex flex-col items-center pb-18">
            <div className='flex flex-col w-[30rem] md:w-[32rem] lg:w-[45rem]'>
                <span className='sticky top-16 md:top-0 bg-white dark:bg-dark z-[30] text-xl dark:text-white p-6 mt-6 font-bold 
                                border-b-[1px] border-light-border dark:border-dark-border'>
                    Bookmarks
                </span>
                {loading ? (
                        <div className="mt-6 flex flex-col gap-4">
                            <PostLoading/>
                            <PostLoading/>
                            <PostLoading/>
                        </div>
                    ) : (savedPosts.map((post, index) => {
                    const isLast = index === savedPosts.length - 1;
                    return (
                        <div
                        key={post.id}
                        ref={isLast ? lastPostElementRef : null}
                        className="py-2 border-b-[1px] border-light-border dark:border-dark-border"
                        >
                        <Post post={post} profile={post.profile} loading={loading} />
                        </div>
                    );}
                ))}
            </div>
        </div>
    )
}

export default BookmarksPage
