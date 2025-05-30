import React from 'react'
import useFriends from '../../hook/useFriends'
import { Link } from 'react-router-dom';
import useStatus from '../../hook/useStatus';
import { FaCircle } from "react-icons/fa6";

function FriendList() {
    const { friends, loading, error } = useFriends(); 
    const statusMap = useStatus(friends);

    if(loading){
        return(
            <div className='w-full flex p-2 items-center gap-4 rounded-xl '>
                <div className="w-10 aspect-square rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse">
                </div>
                <div className='w-20 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse'>
                </div>
            </div>
        )
    }
    return (
        <div className="w-full dark:text-dark-text max-h-[25rem] overflow-y-auto">
            <span className="text-xl font-semibold">Friends</span>
            {
                friends.length === 0 && (
                    <div className="w-full flex flex-col gap-3 items-center justify-center text-light-input-disabled-text dark:text-dark-input-disabled-text">
                        <span className="mt-20 text-lg">No friends yet</span>
                        <span>Follow your followers to make connections.</span>
                    </div>
                )
            }
            <div className='mt-4 flex flex-col gap-2'>
                {
                    friends.slice(0, 5).map((friend) => {
                        return (
                            <Link 
                                key={friend.id}
                                to={`/profile/${friend.id}`} 
                                className='w-full flex p-2 items-center gap-4 rounded-xl 
                                hover:bg-light-card dark:hover:bg-dark-card cursor-pointer relative'>
                                <div
                                    className="w-10 aspect-square rounded-full bg-center bg-cover"
                                    style={{ backgroundImage: `url(${friend.profile_pic_url})` }}
                                ></div>
                                <span>
                                    {friend.username}
                                </span>
                                <div className='absolute top-1/2 -translate-y-1/2 right-10'>
                                    { 
                                        statusMap[friend.id] === "Online" ? (
                                            <FaCircle className='text-green-500' size={8}/>
                                        ) : statusMap[friend.id] === "Undefined" ? (
                                            <></>
                                        ) : (
                                            <p className="text-sm text-gray-500">{statusMap[friend.id]}</p>
                                        )
                                    }
                                </div>
                                
                            </Link>
                        )
                    })
                }
            </div>
            {
                friends.length > 0 && (
                    <Link className='block w-full text-center text-blue-500 dark:text-blue-400' to={`/friends`}>
                        <span>See more...</span>
                    </Link>
                )
            }
        </div>
    )
}

export default FriendList
