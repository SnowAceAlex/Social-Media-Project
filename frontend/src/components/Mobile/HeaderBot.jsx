import React, { useEffect, useRef, useState } from 'react';
import { GoHome, GoHomeFill } from "react-icons/go";
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../helpers/getCurrentUser';
import { IoMenu, IoLogOutOutline } from "react-icons/io5";
import MenuItem from '../MenuItem';
import { TbSettings2 } from "react-icons/tb";
import { LuSunMedium } from "react-icons/lu";
import { useTheme } from '../../contexts/ThemeContext';
import { IoIosMenu } from "react-icons/io";
import ConfirmModal from '../Modal/ConfirmModal';
import { useSocket } from '../../contexts/SocketContext';
import { CiBookmark } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoBookmark } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function HeaderBotMB() {
    const currentUser = useSelector(state => state.user.currentUser);
    const [activeTab, setActiveTab] = useState('home');
    const [showMore, setShowMore] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { toggleTheme } = useTheme();
    const { logout } = useSocket();
    const moreRef = useRef(null);  
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith('/conversation')) setActiveTab('conversation');
        else if (location.pathname.startsWith('/home')) setActiveTab('home');
        else if (location.pathname.startsWith('/bookmarks')) setActiveTab('bookmarks');
        else if (location.pathname.startsWith('/profile')) setActiveTab('profile');
        else setActiveTab('');
    }, [location.pathname]);

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
        <div className="w-full h-14 fixed bottom-0 left-0 bg-light z-50 md:hidden
                        flex items-center justify-between px-10 border-t-2 border-gray-200
                        dark:border-dark-border
                        dark:bg-dark dark:text-dark-text">
            
            <div className="relative" ref={moreRef}>
                <div
                    className="flex items-center justify-start w-full h-fit gap-4
                               rounded-xl cursor-pointer
                               transition-all duration-200 ease-in-out"
                    onClick={() => setShowMore(!showMore)}
                >
                    {showMore ? <IoMenu size={30} /> : <IoIosMenu size={30} />}
                </div>

                {showMore && (
                    <div className="absolute -left-6 bottom-full mb-2 h-fit w-70 bg-white border border-gray-200 rounded-lg
                                    py-4 flex flex-col gap-2 shadow-lg items-center
                                    dark:bg-dark-card dark:text-white dark:border-dark-border"
                        style={{marginBottom:'20px'}}>
                        <MenuItem icon={TbSettings2} label="Settings" />
                        <MenuItem icon={LuSunMedium} label="Switch appearance" onClick={toggleTheme} />
                        <hr className="my-1 border-t-1 border-gray-200 dark:border-dark-button w-full" />
                        <MenuItem icon={IoLogOutOutline} label="Log out" isLogout="true"
                            onClick={() => setShowLogoutConfirm(true)} />
                    </div>
                )}
            </div>

            <Link
                to="/bookmarks"
            >  
                {activeTab === 'bookmarks' ? 
                    (<IoBookmark title="Bookmarks" size={27} className='cursor-pointer'/>) : 
                    (<CiBookmark title="Bookmarks" size={27} className='cursor-pointer'/>)
                } 
            </Link>

            <Link
                to="/home"
            >
                {activeTab === 'home' ? 
                    (<GoHomeFill title="Home" size={30} className='cursor-pointer'/>) : 
                    (<GoHome title="Home" size={30} className='cursor-pointer'/>)
                }
            </Link>

            <Link
                to="/conversation"
            >  
                {activeTab === 'conversation' ? 
                    (<RiSendPlaneFill title="Conversation" size={27} className='cursor-pointer'/>) : 
                    (<LuSend title="Conversation" size={27} className='cursor-pointer'/>)
                } 
            </Link>

            <Link
                to="/profile/me"
                className={`rounded-full overflow-hidden bg-gray-300 box-border flex items-center justify-center border-[2px] w-9 h-9 
                            ${activeTab === 'profile' ? "aspect-square border-dark-border dark:border-light-border" : "border-none"}`}>
                    <img
                        src={currentUser?.profile_pic_url}
                        alt="avatar"
                        className="w-full h-full aspect-square object-cover"
                    />
            </Link>
            {showLogoutConfirm && (
                <ConfirmModal
                    title="Log out?"
                    content="Are you sure you want to log out?"
                    confirm="Confirm"
                    to=""
                    onConfirm={async () => { await logout(); navigate("/"); }}
                    onCancel={() => setShowLogoutConfirm(false)}
                />
            )}
        </div>
    )
}

export default HeaderBotMB;
