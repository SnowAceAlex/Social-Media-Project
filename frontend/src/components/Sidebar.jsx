import React, { useEffect, useRef, useState } from 'react'
import { MdHomeFilled } from "react-icons/md";
import SidebarItem from '../components/SidebarItem';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { RiMenuFill } from "react-icons/ri";
import { TbSettings2 } from "react-icons/tb";
import { MdOutlineDarkMode } from "react-icons/md";
import { useTheme } from '../contexts/ThemeContext';
import useProfile from '../hook/useProfile';

function Sidebar() {
    const navigate = useNavigate();
    const [showMore, setShowMore] =useState(false);
    const moreRef = useRef(null);
    const { toggleTheme } = useTheme();
    const { profile, loading, error } = useProfile();

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
    <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-1/6 md:bg-light
                            dark:bg-dark dark:text-white
                            border-r-2 border-gray-200 
                            dark:border-r-2 dark:border-dark-border 
                            py-8 px-2
                            hidden md:flex flex-col
                            min-w-48 z-50">
        <span className="font-norican-regular text-3xl mb-18 ml-4">Instagram</span>
        <div className='flex flex-col gap-2 flex-grow'>
            <SidebarItem icon={MdHomeFilled} label="Home" onClick={() => navigate("/home")} />
            <SidebarItem icon={IoIosSearch} label="Search" />
            <div className='flex items-center justify-start w-full h-fit py-2 px-4 gap-4
                            rounded-xl hover:bg-light-hover cursor-pointer
                            transition-all duration-200 ease-in-out
                            dark:hover:bg-dark-hover'
                onClick={() => navigate("/profile")}>
                <div className='w-8 h-8 rounded-full overflow-hidden bg-gray-300'>
                    {loading ? (
                    <div className='w-full h-full bg-gray-300 animate-pulse rounded-full' />
                    ) : (
                    <img
                        src={profile?.profile_pic_url}
                        alt="avatar"
                        className='w-full h-full object-cover'
                    />
                    )}
                </div>                
                <p className='font-medium text-lg'>Profile</p>
            </div>
        </div>
        <div className="relative" ref={moreRef}>
                <div className="flex items-center justify-start w-full h-fit py-2 px-4 gap-4
                                rounded-xl hover:bg-light-hover cursor-pointer
                                transition-all duration-200 ease-in-out\
                                dark:hover:bg-dark-hover"
                    onClick={() => setShowMore(!showMore)}>
                    <RiMenuFill size={30} />
                    <p className="font-medium text-lg">More</p>
                </div>
                {showMore && (
                    <div className="absolute left-4 bottom-full mb-2 h-fit w-60 bg-white border border-gray-200 rounded-lg
                                    py-8 px-2 flex flex-col gap-2 shadow-lg
                                    dark:bg-dark-card dark:text-white dark:border-dark-border">
                        <SidebarItem icon={TbSettings2} label="Settings" />
                        <SidebarItem icon={MdOutlineDarkMode} label="Dark mode" onClick={toggleTheme} />
                    </div>
                )}
        </div>
    </div>
    )
}

export default Sidebar
