import React, { useEffect, useState } from 'react'
import usePostService from '../hook/usePostService'
import { BiSolidComment } from "react-icons/bi";
import { FaHeart } from "react-icons/fa6";
import CommentModal from './Modal/CommentModal';
import { HiSquare2Stack } from "react-icons/hi2";

function Media({userId, profile}) {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const {postsWithImages, fetchPostsWithImages, loading, error} = usePostService();
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(()=>{
        if (userId) {
            fetchPostsWithImages(userId);
        }
    },[userId, fetchPostsWithImages]);

    console.log(postsWithImages);
    if(loading) 
        return (
            <div className='h-6 aspect-square mt-10'>
                <img src='/assets/loading.gif'/>
            </div>)

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-0.5 w-[120%] p-2 mt-4">
            {postsWithImages.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500">No posts found.</div>
            ) : (
                postsWithImages.map((post) => (
                    <div key={post.id} className="w-full overflow-hidden relative group cursor-pointer h-96"
                        onClick={() => {setShowCommentModal(true), setSelectedPost(post);}}>
                        {post.images.length > 0 && (
                            <img
                                src={post.images[0]}
                                alt={post.caption}
                                className="w-full h-full object-cover transition-transform duration-300"
                            />
                        )}
                        <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center
                                        text-white font-bol group-hover:opacity-100 opacity-0 transition-opacity duration-75 ease-in-out'>
                            <div className='flex gap-6'>
                                <div className='flex gap-2 items-center'>
                                    {post.react_count} <FaHeart size={20}/>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    {post.comment_count} <BiSolidComment size={20}/>
                                </div>
                            </div>
                        </div>
                        {
                            post.images.length > 1 && (
                                <HiSquare2Stack size={30} className='text-white absolute bottom-5 right-5'/>
                            )
                        }
                    </div>
                ))
            )}
            {
                showCommentModal && (
                    <CommentModal 
                    profile={profile}
                    loading={loading}
                    post={selectedPost}
                    onClose={() => {setShowCommentModal(false), setSelectedPost(null);}}/>
                )
            }
        </div>
    )
}

export default Media
