import React from 'react'
import { useParams } from 'react-router-dom'
import useHashtag from '../hook/useHashtag';
import PostLoading from '../components/Skeleton/PostLoading';
import Post from '../components/Post';

function HashtagPage() {
    const {hashtag} = useParams();
    const {posts, loading, error} = useHashtag(hashtag);
    console.log(posts);
    return (
        <div className="md:ml-9 lg:ml-0 flex flex-col items-center pb-18">
            <div className='flex flex-col w-[30rem] md:w-[32rem] lg:w-[45rem]'>
                <span className='sticky top-16 md:top-0 bg-white dark:bg-dark z-[30] text-xl dark:text-white p-6 mt-6 font-bold 
                                border-b-[1px] border-light-border dark:border-dark-border'>
                    {"#" + hashtag}
                </span>
                {loading ? (
                        <div className="mt-6 flex flex-col gap-4">
                            <PostLoading/>
                            <PostLoading/>
                            <PostLoading/>
                        </div>
                    ) : (
                        posts.map((item, index) => (
                            <div
                            key={index}
                            className="py-2 border-b-[1px] border-light-border dark:border-dark-border">
                        <Post key={item.post.id} post={item.post} profile={item.profile}/>
                        </div>
                        ))
                )}
            </div>
        </div>
    )
}

export default HashtagPage
