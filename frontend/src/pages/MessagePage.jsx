import React, { useEffect, useState } from 'react'
import useProfile from '../hook/useProfile';
import { getCurrentUser } from '../helpers/getCurrentUser';
import { RiSendPlaneFill } from "react-icons/ri";
import NewMessageModal from '../components/Modal/newMessageModal';
import { useConversation } from '../hook/useConversation';
import { Link, useParams } from 'react-router-dom';
import ConservationFrame from '../components/MessagePage/ConservationFrame';
import SearchLoading from '../components/Skeleton/SearchLoading';
import { useJoinChatRoom } from '../hook/useRoomChat';
import useStatus from '../hook/useStatus';
import { FaCircle } from 'react-icons/fa';
import { useConversationSocket } from '../hook/useConversationSocket';

function MessagePage() {
    const { conversationId } = useParams();
    const {currentUser} = getCurrentUser();
    const {updateProfileLocally, profile } = useProfile(currentUser?.user?.id);
    const [createMessageModal, setShowCreateMessageModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const {
        loading,
        receiver,
        conversation,
        allConversation,
        setAllConversation,
        partnersIds,
        fetchAllConservations,
        fetchReceiver,
        error,
        createOrGetConversation } = useConversation()

    //GET STATUS
    const statusMap = useStatus(partnersIds.map(id => ({ id })));

    //JOIN ROOM CONVERSATION
    const currentUserId = currentUser?.user?.id;
    const receiverId = receiver?.id;
    useJoinChatRoom({ currentUserId, receiverId });

    useEffect(() => {
        fetchAllConservations();
        if(conversationId) fetchReceiver(conversationId);
    }, [conversationId]);

    //UPDATE CONVERSATION SOCKET
    useConversationSocket(currentUser?.user?.id, setAllConversation);

    return (
        <>
            <div className='relative w-full border-l border-light-border dark:border-dark-border/50 dark:text-dark-text h-screen flex'>
                {/* Conservations List */}
                <div className='border-r border-light-border dark:border-dark-border/50 flex flex-col gap-8
                                pt-4 md:pt-12 md:px-8 w-[5rem] md:w-[8rem] lg:w-[27rem] flex-shrink-0:'>
                    <div className='w-full text-2xl font-bold flex justify-center lg:justify-between items-center'>
                        <span className='hidden lg:block'>{profile?.username}</span>
                        <RiSendPlaneFill 
                            onClick={()=>{setShowCreateMessageModal(true)}}
                            size={28} 
                            title='Create message' 
                            className='cursor-pointer'/>
                    </div>  
                    <div className='w-full '>
                        <span className='text-xl font-bold hidden lg:block'>Messages</span>
                        <div className='flex flex-col gap-4 mt-4'>
                            {loading && 
                                <>
                                <div className='hidden md:flex flex-col'>
                                    <SearchLoading/>
                                    <SearchLoading/>
                                    <SearchLoading/>
                                </div>
                                <div className='flex flex-col md:hidden'>
                                    <div className="flex items-center gap-3 py-2 px-4 rounded animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-light-skeleton-base dark:bg-dark-skeleton-base"></div>
                                    </div>
                                    <div className="flex items-center gap-3 py-2 px-4 rounded animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-light-skeleton-base dark:bg-dark-skeleton-base"></div>
                                    </div>
                                    <div className="flex items-center gap-3 py-2 px-4 rounded animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-light-skeleton-base dark:bg-dark-skeleton-base"></div>
                                    </div>
                                </div>
                                </>}
                            {error && <div className="text-red-500">Error loading conversations</div>}

                            {!loading && allConversation.length === 0 && (
                                <div className='text-gray-400'>No conversations yet.</div>
                            )}
                            {allConversation.map((c) => (
                                <Link 
                                    key={c.id} 
                                    to={`/conversation/${c.id}/`}
                                    className={`p-2 rounded cursor-pointer flex items-center gap-4 justify-center lg:justify-start
                                    ${String(conversationId) === String(c.id) 
                                    ? 'bg-light-hover dark:bg-dark-hover' 
                                    : 'hover:bg-light-hover dark:hover:bg-dark-hover'}`}>
                                        <div className='w-12 h-12 rounded-full bg-center bg-cover relative'
                                            style={{backgroundImage:`url(${c.partner_avatar})`}}>
                                                {
                                                    statusMap[c.partner_id] === "Online" && (
                                                    <FaCircle 
                                                    className='text-green-500 rounded-full border-2 border-light dark:border-dark absolute -bottom-0.5 right-0' size={15} />)
                                                }
                                        </div>
                                        <div className='flex-col hidden lg:flex overflow-hidden break-words'>
                                            <div className='font-semibold'>{c.partner_username}</div>
                                            <div className='text-sm text-gray-500 truncate'>
                                                {c.last_message || 'No messages yet'}
                                            </div>
                                        </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Conservation */}
                <div className='flex-5'>
                    {
                        receiver ? 
                        (<ConservationFrame 
                            senderId={currentUserId}
                            receiver={receiver} 
                            conversationId={conversationId}
                            setShowCreateMessageModal={setShowCreateMessageModal}/>)
                        :(
                            <ConservationFrame 
                            setShowCreateMessageModal={setShowCreateMessageModal}/>
                        )
                    }
                </div>  
            </div>
            {
                createMessageModal && (
                    <NewMessageModal 
                    key={conversationId}
                    onClose={()=>setShowCreateMessageModal(false)}
                    setSelectedUserId={setSelectedUserId}
                    selectedUserId={selectedUserId}/>
                )
            }
        </>
    )
}

export default MessagePage
