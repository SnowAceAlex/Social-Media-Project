import React, { useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import useStatus from '../../hook/useStatus';
import useFriends from '../../hook/useFriends';
import { TiTick } from "react-icons/ti";
import { useConversation } from '../../hook/useConversation';
import { useNavigate } from 'react-router-dom';

function NewMessageModal({ onClose, setSelectedUserId, selectedUserId }) {
    const { friends, loading, error } = useFriends(); 
    const statusMap = useStatus(friends);
    const [searchTerm, setSearchTerm] = useState("");
    const { createOrGetConversation  } = useConversation();
    const navigate = useNavigate();

    const filteredFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // const toggleSelect = (userId) => {
    //     setSelectedUserIds(prev => 
    //         prev.includes(userId)
    //             ? prev.filter(id => id !== userId)
    //             : [...prev, userId]
    //     ); 
    // };
    const handleChatClick = async () => {
        if (selectedUserId) {
            try {
                const data = await createOrGetConversation(selectedUserId);
                navigate(`/conversation/${data.conversation.id}/`);
                onClose();
            } catch (err) {
                console.error("Error creating conversation:", err);
            }
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full z-[99] bg-black/50 flex items-center justify-center dark:text-dark-text">
            <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative bg-white dark:bg-dark-card p-6 w-[30rem] h-[62vh] max-h-[80vh] rounded-xl overflow-auto shadow-lg scrollbar-hidden"
            >
                {/* Header */}
                <div className="flex w-full items-center mb-4 relative">
                    <h2 className="text-xl font-bold dark:text-dark-text w-full text-center">New message</h2>
                    <IoCloseOutline
                        size={28}
                        onClick={onClose}
                        title="Close"
                        className="p-1 bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text rounded-full cursor-pointer absolute right-0 top-1/2 -translate-y-1/2"
                    />
                </div>

                {/* Search */}
                <div className="relative mb-6 flex">
                    <div className='p-2 h-full flex justify-center items-center'>
                        To:
                    </div>
                    <input
                        type="text"
                        placeholder="Search username or name..."
                        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:bg-dark-card dark:border-dark-border dark:text-dark-text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400"
                        >
                            <IoIosClose size={20} />
                        </button>
                    )}
                </div>

                {/* Friend list */}
                <div className='flex flex-col w-full gap-2 h-[18rem] overflow-y-auto'>
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend) => {
                            const isSelected = selectedUserId === friend.id;
                            return(
                            <div 
                                key={friend.id}
                                onClick={() => {setSelectedUserId(isSelected ? null : friend.id)}}
                                className="flex items-center justify-between py-2 px-4 rounded 
                                hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer">
                                <div className='flex gap-4 h-full items-center'>
                                    <img
                                    src={friend.profile_pic_url || "/default-avatar.png"}
                                    alt={friend.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="font-semibold text-black dark:text-dark-text">
                                        {friend.username}
                                    </div>
                                </div>
                                <div  className={`h-2/3 aspect-square rounded-full border 
                                            ${isSelected 
                                                ? 'bg-blue-500 text-white border-blue-500' 
                                                : 'border-light-input-disabled-text dark:border-dark-border'} 
                                            flex justify-center items-center cursor-pointer`}>
                                    <TiTick/>
                                </div>
                            </div>
                        )})
                    ) : (
                        <p className="text-gray-500 dark:text-dark-text-subtle">No friends found.</p>
                    )}
                </div>
                <button 
                onClick={() => handleChatClick()}
                className='mt-6 text-white w-full py-2 rounded-lg bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4] cursor-pointer'>Chat</button>
            </motion.div>
        </div>
    );
}

export default NewMessageModal;