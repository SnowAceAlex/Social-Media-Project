import React, { useEffect, useRef, useState } from 'react'
import { MdHomeFilled } from "react-icons/md";
import SidebarItem from '../components/SidebarItem';
import { IoIosClose, IoIosSearch } from "react-icons/io";
import { LuSunMedium } from "react-icons/lu";
import { IoIosMenu } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { TbSettings2 } from "react-icons/tb";
import { useTheme } from '../contexts/ThemeContext';
import { IoLogOutOutline } from "react-icons/io5";
import useProfile from '../hook/useProfile';
import MenuItem from './MenuItem';
import { LuInstagram } from "react-icons/lu";
import { motion, AnimatePresence } from 'framer-motion';
import useMediaQuery from '../hook/useMediaQuery';
import SearchFrame from './SearchFrame';
import { getCurrentUser } from '../helpers/getCurrentUser';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ searchValue, setSearchValue }) {
    const [showMore, setShowMore] = useState(false);
    const moreRef = useRef(null);
    const { toggleTheme } = useTheme();
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [showSearchFrame, setShowSearchFrame] = useState(false);
    const {currentUser,loading} = getCurrentUser();
    const location = useLocation();
    const pathname = location.pathname;

    const handleToggleSearch = () => {
        if (!isSearchMode) {
            setShowSearchFrame(true);
            setIsSearchMode(true);
        } else {
            setIsSearchMode(false);
            setShowSearchFrame(false)
        }
    };

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

    return (
        <>
        <div className={`md:fixed md:top-0 md:left-0 md:h-screen md:bg-light
                                dark:bg-dark dark:text-white
                                py-8 px-2
                                hidden md:flex flex-col
                                z-50
                                transition-all duration-300
                        ${isSearchMode ? 'md:w-20 border-r-1  border-transparent  min-w-20' : 
                        'md:w-1/6 border-r-1 border-gray-200 dark:border-r-2 dark:border-dark-border  min-w-48 '}`}>
            <AnimatePresence mode="wait">
                {!isSearchMode ? (
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
                    <LuInstagram size={34} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='flex flex-col gap-2 flex-grow items-center'>
                <SidebarItem
                    icon={MdHomeFilled}
                    label="Home"
                    to="/home"
                    isCollapsed={isSearchMode}
                    isActive={pathname.startsWith('/home')} 
                />

                <SidebarItem
                    icon={IoIosSearch} 
                    label="Search"
                    onClick={handleToggleSearch}
                    isCollapsed={isSearchMode} 
                />
                <Link
                    to="/profile/me"
                    className={`flex items-center justify-start w-full h-fit py-2 px-4 gap-4
                        rounded-xl hover:bg-light-hover cursor-pointer
                        transition-all duration-200 ease-in-out dark:hover:bg-dark-hover
                        ${pathname.startsWith('/profile') ? 'font-bold bg-light-hover dark:bg-dark-hover' : 'font-[400]'}`} 
                    >
                    <div className={`rounded-full overflow-hidden bg-gray-300 box-border
                                    ${pathname.startsWith('/profile') ? "w-9 h-9 border-[3px] border-dark-border dark:border-light-border" : "w-8 h-8"}`}>
                        {loading ? (
                        <div className='w-full h-full bg-gray-300 animate-pulse rounded-full' />
                        ) : (
                        <img
                            src={currentUser?.user?.profile_pic_url}
                            alt="avatar"
                            className={`w-full h-full object-cover"}`}
                        />
                        )}
                    </div>
                    {!isSearchMode && <p className='text-md'>Profile</p>}
                </Link>
            </div>
            <div className="relative" ref={moreRef}>
                    <div className="flex items-center justify-start w-full h-fit py-2 px-4 gap-4
                                    rounded-xl hover:bg-light-hover cursor-pointer
                                    transition-all duration-200 ease-in-out\
                                    dark:hover:bg-dark-hover"
                        onClick={() => setShowMore(!showMore)}>
                        {
                            showMore ? <IoMenu size={30}/> : <IoIosMenu size={30} />
                        }
                        {!isSearchMode && 
                            <p className={`${showMore ? "font-[700]" : "font-[400]"} text-md  `}>More</p>}    
                    </div>
                    {showMore && (
                        <div className="absolute left-4 bottom-full mb-2 h-fit w-70 bg-white border border-gray-200 rounded-lg
                                        py-4 flex flex-col gap-2 shadow-lg items-center
                                        dark:bg-dark-card dark:text-white dark:border-dark-border">
                            <MenuItem icon={TbSettings2} label="Settings" />
                            <MenuItem icon={LuSunMedium} label="Switch appearance" onClick={toggleTheme} />
                            <hr className="my-1 border-t-1 border-gray-200 dark:border-dark-button w-full" />
                            <MenuItem icon={IoLogOutOutline} label="Log out" to="/" isLogout="true" />
                        </div>
                    )}
            </div>
        </div>
        {/* Search Frame */}
        <SearchFrame showSearchFrame={showSearchFrame} searchValue={searchValue} setSearchValue={setSearchValue}/>
        </>
    )
}

export default Sidebar
