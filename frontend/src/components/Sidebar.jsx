import React, { useEffect, useRef, useState } from 'react'
import { MdHomeFilled } from "react-icons/md";
import SidebarItem from '../components/SidebarItem';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { RiMenuFill } from "react-icons/ri";
import { TbSettings2 } from "react-icons/tb";
import { MdOutlineDarkMode } from "react-icons/md";

function Sidebar() {
    const navigate = useNavigate();
    const [showMore, setShowMore] =useState(false);
    const moreRef = useRef(null);

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
    <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-1/6 md:bg-[#f9f9f9] 
                            border-r-2 border-gray-200 py-8 px-2
                            hidden md:flex flex-col
                            min-w-48 z-[99]">
        <span className="font-norican-regular text-3xl mb-18 ml-4">Instagram</span>
        <div className='flex flex-col gap-2 flex-grow'>
            <SidebarItem icon={MdHomeFilled} label="Home" onClick={() => navigate("/home")} />
            <SidebarItem icon={IoIosSearch} label="Search" />
            <div className='flex items-center justify-start w-full h-fit py-2 px-4 gap-4
                            rounded-xl hover:bg-[#EAEAEA] cursor-pointer
                            transition-all duration-200 ease-in-out'
                onClick={() => navigate("/profile")}>
                <div className='w-8 h-8 bg-gray-300 rounded-full'></div>
                <p className='font-medium text-lg'>Profile</p>
            </div>
        </div>
        <div className="relative" ref={moreRef}>
                <div className="flex items-center justify-start w-full h-fit py-2 px-4 gap-4
                                rounded-xl hover:bg-[#EAEAEA] cursor-pointer
                                transition-all duration-200 ease-in-out"
                    onClick={() => setShowMore(!showMore)}>
                    <RiMenuFill size={30} />
                    <p className="font-medium text-lg">More</p>
                </div>
                {showMore && (
                    <div className="absolute left-4 bottom-full mb-2 h-fit w-60 bg-white border border-gray-200 rounded-lg
                                    py-8 px-2 flex flex-col gap-2 shadow-lg">
                        <SidebarItem icon={TbSettings2} label="Settings" />
                        <SidebarItem icon={MdOutlineDarkMode} label="Dark mode" />
                    </div>
                )}
        </div>
    </div>
    )
}

export default Sidebar
