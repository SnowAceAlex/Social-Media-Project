import React, { useRef, useState, useEffect } from 'react';
import useStatus from '../../hook/useStatus';
import { Link } from 'react-router-dom';
import TextareaAutosize from "react-textarea-autosize";
import EmojiPickerButton from '../EmojiPickerButton';
import { useMessage } from '../../hook/useMessage';
import { FaCircle } from 'react-icons/fa';
import { useSocket } from '../../contexts/SocketContext';
import { useMessageSocket } from '../../hook/useMessageSocket';
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { formatSmartTime } from '../../utils/formatDate';
import { MdDelete } from "react-icons/md";
import ConfirmModal from '../Modal/ConfirmModal';
import { BsChatHeart } from "react-icons/bs";
import NewMessageModal from '../Modal/newMessageModal';
import { isOnlyEmoji } from '../../utils/checkEmoji';

function ConservationFrame({ senderId, receiver, conversationId, setShowCreateMessageModal }) {
    if(!conversationId){
        return(
            <div className='w-full h-full flex flex-col justify-center items-center text-black dark:text-dark-text gap-4    '>
                <BsChatHeart size={40}/>
                <span className='text-2xl font-semibold'>Let’s talk about it...</span>
                <span>Start chatting and define your story together.</span>
                <button 
                onClick={()=>{setShowCreateMessageModal(true)}}
                className='px-4 py-2 bg-blue-500 rounded-xl text-white cursor-pointer'>Start</button>
            </div>
        )
    }

    // ===== 1. STATE & REF =====
    const statusMap = useStatus([receiver]);
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);
    const { loadingMessage, errorMessage, fetchSentMessage, fetchMessages, handleDeleteMessage } = useMessage();
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isFirstLoad = useRef(true);
    const scrollContainerRef = useRef(null);
    const [isFetchingMessages, setIsFetchingMessages] = useState(false);
    const pageRef = useRef(1);
    const loadingRef = useRef(false);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    // ===== 2. HANDLER FUNCTION =====
    const handleChange = (newValue) => setMessage(newValue);

    const handleSentMessage = async () => {
        if (!message.trim()) return;
        try {
            await fetchSentMessage(receiver.id, message);
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    };

    // ===== 3. LOAD/FETCH FUNCTION =====
    const loadMore = async () => {
        if (loadingRef.current || !hasMore) return;

        const container = scrollContainerRef.current;
        const previousScrollHeight = container?.scrollHeight || 0;
        const previousScrollTop = container?.scrollTop || 0;

        const currentPage = pageRef.current;
        loadingRef.current = true;
        setIsFetchingMessages(true);

        try {
            const data = await fetchMessages(conversationId, currentPage, { forceRefresh: true });
            if (!data || !data.messages || data.messages.length === 0) {
                setHasMore(false);
                return;
            }

            setMessages(prev => {
                const prevIds = new Set(prev.map(m => m.id));
                const newMessages = data.messages
                    .filter(m => !prevIds.has(m.id))
                    .reverse();
                return [...newMessages, ...prev];
            });

            pageRef.current = currentPage + 1;
            setPage(pageRef.current);
            setHasMore(data.hasMore);

            setTimeout(() => {
                const container = scrollContainerRef.current;
                if (container) {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
                }
            }, 0);
        } catch (e) {
            console.error("Fetch failed:", e);
        } finally {
            loadingRef.current = false;
            setIsFetchingMessages(false);
        }
    };

    // ===== 4. AUTO LOAD/SCROLL FUNCTION =====
    const ensureScrollable = () => {
        const container = scrollContainerRef.current;
        if (!container || !hasMore || loadingRef.current) return;

        const checkScrollable = () => {
            const container = scrollContainerRef.current;
            if (!container) return;
            const canScroll = container.scrollHeight > container.clientHeight;
            if (!canScroll && hasMore) {
                loadMore().then(() => {
                    requestAnimationFrame(() => {});
                });
            }
        };
        checkScrollable();
    };

    // ===== 5. EFFECT: RESET & INITIAL LOAD WHEN CHANGE CONVERSATION =====
    useEffect(() => {
        let isMounted = true;
        const resetStateAndLoad = async () => {
            loadingRef.current = false;
            pageRef.current = 1;
            isFirstLoad.current = true;
            setPage(1);
            setMessages([]);
            setHasMore(true);

            await new Promise((r) => setTimeout(r, 0));
            if (!isMounted) return;

            try {
                const data = await fetchMessages(conversationId, 1);
                const newMessages = data.messages.reverse();
                setMessages(newMessages);
                setHasMore(data.hasMore);
                pageRef.current = 2;
                setPage(2);

                if (data.hasMore) loadMore();

                requestAnimationFrame(() => {
                    const container = scrollContainerRef.current;
                    if (container) container.scrollTop = container.scrollHeight;
                });

                setTimeout(ensureScrollable, 0);
            } catch (error) {
                console.error("Initial load failed:", error);
            }
        };
        resetStateAndLoad();
        return () => { isMounted = false; };
    }, [conversationId]);

    // ===== 6. EFFECT: AUTO FETCH WHEN SCROLL TO ABOVE =====
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const handleScroll = () => {
            if (container.scrollTop < 80 && !loadingRef.current && hasMore) {
                loadMore();
            }
        };
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    // ===== 7. EFFECT: SCROLL TO BOTTOM ON PAGE RESET =====
    useEffect(() => {
        if (page === 0) {
            requestAnimationFrame(() => {
                const container = scrollContainerRef.current;
                if (container) container.scrollTop = container.scrollHeight;
            });
        }
    }, [page]);

    // ===== 8. EFFECT: SCROLL TO BOTTOM ON FIRST LOAD =====
    useEffect(() => {
        if (isFirstLoad.current) {
            const container = scrollContainerRef.current;
            if (container) container.scrollTop = container.scrollHeight;
            isFirstLoad.current = false;
        }
    }, [messages]);

    // ===== 9. EFFECT: AUTO ENSURE SCROLLABLE =====
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !hasMore || loadingRef.current) return;
        const canScroll = container.scrollHeight > container.clientHeight;
        if (!canScroll && hasMore) {
            ensureScrollable();
        }
    }, [messages, hasMore]);

    // ===== 10. SOCKET SETUP =====
    useMessageSocket(conversationId, setMessages, scrollContainerRef);

    // ===== 11. MENU MESSAGE =====
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRefs = useRef({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = Object.values(menuRefs.current);
            const clickedInside = refs.some(ref => ref && ref.contains(event.target));
            if (!clickedInside) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className='w-full h-full flex flex-col'>
            {/* HEADER */}
            <div className='w-full border-b border-light-border dark:border-dark-border h-14 md:h-20 flex items-center px-8'>
                <div className='flex gap-4 items-center'>
                    <div className='w-8 md:w-12 aspect-square bg-center bg-cover rounded-full relative'
                        style={{ backgroundImage: `url(${receiver.profile_pic_url})` }}>
                            {
                                statusMap[receiver.id] === "Online" && (
                                    <FaCircle className='text-green-500 rounded-full border-2 border-light dark:border-dark absolute -bottom-0.5 right-0' size={15} />)
                            }
                    </div>
                    <div>
                        <span className='font-semibold text-lg'>{receiver.username}</span>
                        <span className={`text-gray-500`}>
                            {
                                statusMap[receiver.id] === "Online" ? (
                                    <></>
                                ) : statusMap[receiver.id] === "Undefined" ? (
                                    <></>
                                ) : (
                                    <p className="text-sm text-gray-500">{statusMap[receiver.id]}</p>
                                )
                            }
                        </span>
                    </div>
                </div>
            </div>

            {/* CHAT FRAME */}
            <div className='w-full overflow-y-auto flex-1' ref={scrollContainerRef}>
                {!hasMore && (
                    <div className='w-full h-72 flex items-center justify-center'>
                        <div className='h-60 w-56 flex flex-col justify-center items-center gap-2'>
                            <div className='w-32 aspect-square bg-center bg-cover overflow-hidden rounded-full'
                                style={{ backgroundImage: `url(${receiver.profile_pic_url})` }}>
                            </div>
                            <span className='text-xl font-semibold'>
                                {receiver.username}
                            </span>
                            <Link to={`/profile/${receiver.id}`} className='px-4 py-2 bg-light-button rounded-lg cursor-pointer 
                                hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover'>
                                View profile
                            </Link>
                        </div>
                    </div>
                )}

                {isFetchingMessages && (
                    <div className='mt-8 mb-8 w-full flex items-center justify-center'>
                        <div className='w-5 h-5 bg-center bg-cover'
                            style={{ backgroundImage: `url("/assets/loading.gif")` }}>
                        </div>
                    </div>
                )}

                {/* MESSAGE LIST */}
                <div className='flex flex-col px-4 gap-1'>
                    {messages.map((msg, idx) => {
                        const prevMsg = idx > 0 ? messages[idx - 1] : null;
                        const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;

                        const showAvatar = idx === 0 || (prevMsg && prevMsg.sender_id !== msg.sender_id);

                        const firstOfBlock =
                            idx === 0 ||
                            (prevMsg && prevMsg.sender_id !== msg.sender_id && nextMsg && nextMsg.sender_id === msg.sender_id);

                        const lastOfBlock =
                            idx === messages.length - 1 ||
                            (nextMsg && nextMsg.sender_id !== msg.sender_id && prevMsg && prevMsg.sender_id === msg.sender_id);

                        let rounded = "";
                        if (msg.sender_id == senderId) {
                            if (firstOfBlock) rounded = " rounded-br-sm rounded-3xl";
                            else if (lastOfBlock) rounded = " rounded-tr-sm rounded-3xl"
                            else rounded = "rounded-3xl rounded-tr-sm rounded-br-sm";
                        } else {
                            if (firstOfBlock) rounded = " rounded-bl-sm rounded-3xl";
                            else if (lastOfBlock) rounded = " rounded-tl-sm rounded-3xl"
                            else rounded = "rounded-3xl rounded-tl-sm rounded-bl-sm";
                        }

                        const isOneMessage = (prevMsg && prevMsg.sender_id !== msg.sender_id) && (nextMsg && nextMsg.sender_id !== msg.sender_id);
                        if (isOneMessage) {
                            rounded = "rounded-3xl";
                        }

                        return (
                            <div key={msg.id} className={`w-full flex gap-2 items-center ${msg.sender_id == senderId ? "justify-end" : "justify-start"}`}>
                                {showAvatar ? (
                                    msg.sender_id != senderId ? (
                                        <div
                                            className={`w-10 h-10 overflow-hidden rounded-full bg-center bg-cover ${msg.sender_id == senderId ? "order-3" : "order-1"}`}
                                            style={{ backgroundImage: `url(${msg.sender_profile_pic_url})` }}
                                        />
                                    ) : (
                                        msg.sender_id != senderId && (
                                            <div className={`w-10 h-10 ${msg.sender_id == senderId ? "order-3" : "order-1"}`}></div>
                                        )
                                    )
                                ) : (
                                    msg.sender_id != senderId && (
                                        <div className={`w-10 h-10 ${msg.sender_id == senderId ? "order-3" : "order-1"}`}></div>
                                    )
                                )}
                                <div
                                    className={`py-2 px-4 ${rounded} w-fit max-w-xs overflow-hidden break-words
                                        ${msg.sender_id == senderId
                                        ? isOnlyEmoji(msg.content) ? "order-2" : "order-2 bg-blue-300 dark:bg-blue-500 mr-1"
                                        : isOnlyEmoji(msg.content) ? "order-2" : "order-2 bg-gray-200 dark:bg-dark-button"
                                        }`}
                                    style={isOnlyEmoji(msg.content) ? { fontSize: "2rem", background: "none", padding: "0.25rem 0.5rem" } : {}}
                                    >
                                    {msg.content}
                                </div>
                                <div 
                                ref={(el) => (menuRefs.current[msg.id] = el)}
                                onClick={() => setOpenMenuId(prev => prev === msg.id ? null : msg.id)}
                                title='More'
                                className={`w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center cursor-pointer relative
                                    ${msg.sender_id == senderId ? "order-1" : "order-3"}`}>
                                    <PiDotsThreeVerticalBold size={15}/>
                                    {openMenuId === msg.id &&
                                        (<div 
                                            style={{marginBottom:'20px'}}
                                            className={`absolute bottom-full shadow border
                                                bg-light dark:bg-dark-card rounded-xl border-light-border dark:border-dark-border
                                            ${msg.sender_id == senderId ? "right-0" : "left-0"}`}>
                                                <div className='w-full p-4 text-sm text-nowrap border-b-[1px] border-light-border dark:border-dark-border'>
                                                    {formatSmartTime(msg.created_at)}
                                                </div>
                                                <div 
                                                onClick={()=>{setShowConfirmDelete(true); setMessageToDelete(msg.id)}}
                                                className={`text-red-500 w-full text-center p-4 text-nowrap flex items-center gap-2
                                                            ${msg.sender_id == senderId ?"":"hidden"}`}>
                                                    Delete messages
                                                    <MdDelete size={20}/>
                                                </div>
                                        </div>)
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* INPUT MESSAGE */}
            <div className='mt-auto w-full min-h-20 py-4 px-4 flex items-center gap-2 md:sticky md:bottom-auto bg-white dark:bg-dark'>
                <EmojiPickerButton
                    textareaRef={textareaRef}
                    value={message}
                    onChange={handleChange}
                    top={"bottom-full"}
                    left={"left-0"}
                />
                <div className='w-full h-full border rounded-full border-light-border dark:border-dark-border px-4 overflow-hidden'>
                    <TextareaAutosize
                        ref={textareaRef}
                        minRows={1}
                        maxRows={3}
                        className="flex-1 p-2 resize-none outline-none w-full"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSentMessage();
                            }
                        }}
                    />
                </div>
            </div>

            {
                showConfirmDelete && (
                    <ConfirmModal
                        title="Delete Message"
                        content="Are you sure you want to delete this message?"
                        confirm="Delete"
                        onConfirm={async () => {
                            const success = await handleDeleteMessage(messageToDelete);
                            if (success) {
                                setMessages(prev => prev.filter(m => m.id !== messageToDelete));
                            }
                            setShowConfirmDelete(false);
                            setMessageToDelete(null);
                        }}
                        onCancel={() => {
                            setShowConfirmDelete(false);
                            setMessageToDelete(null);
                    }}/>
                )
            }
        </div>
    );
}

export default ConservationFrame;