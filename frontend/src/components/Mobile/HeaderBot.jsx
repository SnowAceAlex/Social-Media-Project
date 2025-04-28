import React, { useState } from 'react';
import { GoHome, GoHomeFill } from "react-icons/go";
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../helpers/getCurrentUser';

function HeaderBotMB() {
    const { currentUser, loading } = getCurrentUser();
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="w-full h-14 fixed bottom-0 left-0 bg-light z-50 md:hidden
                        flex items-center justify-between px-10 border-t-2 border-gray-200
                        dark:border-dark-border
                        dark:bg-dark dark:text-dark-text">
            <Link
                to="/home"
                onClick={() => setActiveTab('home')}
            >
                {activeTab === 'home' ? 
                    (<GoHomeFill title="Home" size={30} className='cursor-pointer'/>) : 
                    (<GoHome title="Home" size={30} className='cursor-pointer'/>)
                }
            </Link>

            <Link
                to="/profile/me"
                onClick={() => setActiveTab('profile')}
                className={`rounded-full overflow-hidden bg-gray-300 box-border flex items-center justify-center border
                            ${activeTab === 'profile' ? "w-9 h-9 min-w-9 aspect-square border-[2px] border-dark-border dark:border-light-border" : "w-8 h-8"}`}>
                {loading ? (
                    <div className="w-full h-full bg-gray-300 animate-pulse rounded-full" />
                ) : (
                    <img
                        src={currentUser?.user?.profile_pic_url}
                        alt="avatar"
                        className="w-full h-full aspect-square object-cover"
                    />
                )}
            </Link>
        </div>
    )
}

export default HeaderBotMB;
