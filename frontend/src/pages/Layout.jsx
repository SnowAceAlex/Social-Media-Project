import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import HeaderMB from '../components/Mobile/Header';
import HeaderBotMB from '../components/Mobile/HeaderBot';
import EditProfileModal from '../components/Modal/EditProfileModal';
import CreatePostModal from '../components/Modal/CreatePostModal';

function Layout() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    
    useEffect(() => {
        document.body.style.overflow = showEditModal ? 'hidden' : 'auto';
    }, [showEditModal]);

    useEffect(() => {
        document.body.style.overflow = showCreatePostModal ? 'hidden' : 'auto';
    }
    , [showCreatePostModal]);

    return (
        <div className="w-full relative">
            {/* Header (for mobile) */}
            <HeaderMB/>

            <div className="md:flex dark:bg-dark">
                {/* Sidebar */}
                <Sidebar/>
                {/* Main */}
                <div className="flex-1 md:ml-[16.67%] mt-16 mb-14 md:mt-0 md:mb-0 min-h-screen
                                flex flex-col dark:bg-dark
                                ">
                    {/* <div className="h-28 "></div>
                    <div className="h-[42rem]"></div>
                    <div className="h-[42rem] "></div>
                    <div className="h-[42rem] "></div> */}
                    <Outlet context={{ setShowEditModal, setShowCreatePostModal }}/>
                </div>
            </div>

            {/* Header bottom (for mobile) */}
            <HeaderBotMB/>

            {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
            {showCreatePostModal && <CreatePostModal onClose={() => setShowCreatePostModal(false)} />}
        </div>
    )
}


export default Layout