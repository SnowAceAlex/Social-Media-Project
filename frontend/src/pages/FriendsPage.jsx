import React, { useState } from 'react'
import useFriends from '../hook/useFriends';
import useStatus from '../hook/useStatus';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCircle } from 'react-icons/fa';

const MotionLink = motion(Link);

function FriendsPage() {
    const { friends, loading, error } = useFriends(); 
    const statusMap = useStatus(friends);

    const [hoveredId, setHoveredId] = useState(null); 

    if (loading) {
        return (
            <div className='w-full flex p-2 items-center gap-4 rounded-xl '>
                <div className="w-10 aspect-square rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className='w-20 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse'></div>
            </div>
        )
    }

    return (
        <div className="md:ml-9 lg:ml-0 flex flex-col pb-18 p-8 dark:text-dark-text">
            <span className='text-2xl font-semibold mb-8'>Friends List</span>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    friends.map((friend) => {
                        let status = statusMap[friend.id];
                        if(status === "Undefined") status="Offline"
                        const isOnline = status === "Online";
                        
                        return (
                            <MotionLink
                                key={friend.id}
                                to={`/profile/${friend.id}`}
                                whileHover={{ 
                                    scale: 1.03, 
                                    filter: 'brightness(1.15)' 
                                }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className='w-[13rem] sm:w-[17rem] md:w-[18rem] lg:w-[18rem] xl:w-[20rem] aspect-[3/4] rounded-2xl shadow-md flex flex-col overflow-hidden bg-center bg-cover'
                                style={{ backgroundImage: `url(${friend.profile_pic_url})` }}
                            >
                                <div className="mt-auto h-4/5 bg-[linear-gradient(to_bottom,_transparent_20%,_rgba(0,0,0,0.9)_100%)] p-8 flex flex-col">
                                    <div className='mt-auto w-full text-2xl font-bold text-white flex justify-between items-center relative'>
                                        <span className='max-w-40 truncate' title={friend.username}>
                                            {friend.username}
                                        </span>

                                        {/* Status circle */}
                                        <motion.div
                                            onHoverStart={() => setHoveredId(friend.id)}
                                            onHoverEnd={() => setHoveredId(null)}
                                            className="relative"
                                        >
                                            <FaCircle
                                                className={isOnline ? 'text-green-500' : 'text-gray-400'}
                                                size={15}
                                            />
                                            {/* TOOLTIP */}
                                            <AnimatePresence>
                                                {hoveredId === friend.id && (
                                                    <motion.div
                                                        key="tooltip"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: -20 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute -top-6 right-0 px-2 py-1 bg-black text-white text-sm rounded shadow-md z-10 text-nowrap"
                                                    >
                                                        {status || "Unknown"}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </div>
                                </div>
                            </MotionLink>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FriendsPage;
