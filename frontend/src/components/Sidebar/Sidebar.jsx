import React, { useEffect, useRef, useState } from 'react';
import { GoHome } from "react-icons/go";
import { IoIosSearch, IoIosNotificationsOutline, IoIosMenu } from "react-icons/io";
import { LuInstagram, LuSunMedium } from "react-icons/lu";
import { IoMenu, IoLogOutOutline } from "react-icons/io5";
import { TbSettings2 } from "react-icons/tb";
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import MenuItem from '../MenuItem';
import ConfirmModal from '../Modal/ConfirmModal';
import SidebarItem from './SidebarItem';
import SearchFrame from './SearchFrame';
import NotificationFrame from './NotificationFrame';
import { useTheme } from '../../contexts/ThemeContext';
import { getCurrentUser } from '../../helpers/getCurrentUser';
import { useSocket } from '../../contexts/SocketContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { CiBookmark } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { useConversationSocket } from '../../hook/useConversationSocket';
import { useLogout } from '../../hook/useLogout';
import { useSelector } from "react-redux";

function Sidebar({ searchValue, setSearchValue }) {
    const [showMore, setShowMore] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeFrame, setActiveFrame] = useState(null); // "search" | "notification" | null
    const [activeItem, setActiveItem] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { markNotificationsAsSeen, hasNewNotification } = useNotifications();
    const { markMessageAsSeen, hasNewMessage} = useConversationSocket();

    const moreRef = useRef(null);
    const { toggleTheme } = useTheme();
    const currentUser = useSelector(state => state.user.currentUser);
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;
    useEffect(() => {
        if (pathname.startsWith("/conversation")) {
            setIsExpanded(true); 
        } else {
            setIsExpanded(false);
        }
    }, [pathname]);
    const { handleLogout } = useLogout()


    const handleToggleFrame = (frameName) => {
        //nếu active frame đúng bằng frameName -> tắt expanded
        if(frameName === "conversation"){
            setIsExpanded(true);
        }
        else if (activeFrame === frameName) {
            setActiveFrame(null);
            setActiveItem('');
            if (!pathname.startsWith("/conversation")) {
                setIsExpanded(false);
            }   
        } else {
            setActiveFrame(frameName);
            setIsExpanded(true);
            setActiveItem(
                frameName === "search" ? "Search" :
                frameName === "notification" ? "Notification" :
                ''
            );
            if (frameName === "notification") {
                markNotificationsAsSeen();
            }
        }
    };

    useEffect(() => {
        if (!pathname.startsWith("/conversation")) {
            setActiveFrame(null);
            setActiveItem('');
        }
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreRef.current && !moreRef.current.contains(event.target)) {
                setShowMore(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (pathname.startsWith('/conversation')) {
            markMessageAsSeen();
        }
    }, [pathname]);

    return (
        <>
        <div className={`md:fixed md:top-0 md:left-0 md:h-screen md:bg-light
                         dark:bg-dark dark:text-white py-8 px-2 hidden md:flex flex-col
                         z-50 transition-all duration-300
                         ${isExpanded ? 'md:w-20 border-r-[1px] border-transparent min-w-20' : 
                         'md:w-1/6 border-r-[1px] border-gray-200 dark:border-r-2 dark:border-dark-border min-w-48'}`}>
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.span
                        key="text-logo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="font-norican-regular text-3xl mb-18 ml-4"
                    >
                        Instagram
                    </motion.span>
                ) : (
                    <motion.div
                        key="icon-logo"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mb-18 ml-4"
                    >
                        <LuInstagram size={29} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-2 flex-grow items-center">
                <SidebarItem
                    icon={GoHome}
                    label="Home"
                    to="/home"
                    isCollapsed={isExpanded}
                    isActive={pathname.startsWith('/home')}
                />
                <SidebarItem
                    icon={IoIosSearch}
                    label="Search"
                    onClick={() => handleToggleFrame("search")}
                    isCollapsed={isExpanded}
                    isActive={activeItem === 'Search'}
                />
                <Link
                    to="/profile/me"
                    className={`flex items-center justify-start w-full h-fit py-2 px-4 gap-4
                                rounded-xl hover:bg-light-hover cursor-pointer
                                transition-all duration-200 ease-in-out dark:hover:bg-dark-hover
                                ${pathname.startsWith('/profile/me') ? 'font-bold bg-light-hover dark:bg-dark-hover' : 'font-[400]'}`}
                >
                    <div className={`rounded-full overflow-hidden bg-gray-300 box-border flex items-center justify-center
                                    ${pathname.startsWith('/profile/me') ? "w-9 h-9 min-w-9 aspect-square border-[2px] border-dark-border dark:border-light-border" : "w-8 h-8"}`}>
                        <img
                            src={currentUser?.profile_pic_url}
                            alt="avatar"
                            className="w-full h-full aspect-square object-cover"
                        />
                    </div>
                    {!isExpanded && <p className="text-md">Profile</p>}
                </Link>
                <SidebarItem
                    icon={IoIosNotificationsOutline}
                    label="Notification"
                    onClick={() => handleToggleFrame("notification")}
                    isCollapsed={isExpanded}
                    isActive={activeItem === 'Notification'}
                    hasNewNotification={hasNewNotification}
                />
                <SidebarItem
                    icon={CiBookmark}
                    label="Bookmarks"
                    to="/bookmarks"
                    isCollapsed={isExpanded}
                    isActive={pathname.startsWith('/bookmarks')}
                />
                <SidebarItem
                    icon={LuSend}
                    label="Messages"
                    to="/conversation"
                    isCollapsed={isExpanded}
                    isActive={pathname.startsWith('/conversation')}
                    hasNewMessage={hasNewMessage}
                />
                
            </div>

            <div className="relative" ref={moreRef}>
                <div
                    className="flex items-center justify-start w-full h-fit py-2 px-4 gap-4
                               rounded-xl hover:bg-light-hover cursor-pointer
                               transition-all duration-200 ease-in-out dark:hover:bg-dark-hover"
                    onClick={() => setShowMore(!showMore)}
                >
                    {showMore ? <IoMenu size={30} /> : <IoIosMenu size={30} />}
                    {!isExpanded && (
                        <p className={`${showMore ? "font-[700]" : "font-[400]"} text-md`}>
                            More
                        </p>
                    )}
                </div>

                {showMore && (
                    <div className="absolute left-4 bottom-full mb-2 h-fit w-70 bg-white border border-gray-200 rounded-lg
                                    py-4 flex flex-col gap-2 shadow-lg items-center
                                    dark:bg-dark-card dark:text-white dark:border-dark-border">
                        <MenuItem icon={TbSettings2} label="Settings" />
                        <MenuItem icon={LuSunMedium} label="Switch appearance" onClick={toggleTheme} />
                        <hr className="my-1 border-t-1 border-gray-200 dark:border-dark-button w-full" />
                        <MenuItem icon={IoLogOutOutline} label="Log out" isLogout="true"
                            onClick={() => setShowLogoutConfirm(true)} />
                    </div>
                )}
            </div>

            {showLogoutConfirm && (
                <ConfirmModal
                    title="Log out?"
                    content="Are you sure you want to log out?"
                    confirm="Confirm"
                    to=""
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutConfirm(false)}
                />
            )}
        </div>

        {/* Search Frame */}
        <SearchFrame showSearchFrame={activeFrame === "search"} searchValue={searchValue} setSearchValue={setSearchValue} />

        {/* Notification Frame */}
        <NotificationFrame showNotificationFrame={activeFrame === "notification"} />
        </>
    );
}

export default Sidebar;