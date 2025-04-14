import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import HeaderMB from '../components/Mobile/Header';
import HeaderBotMB from '../components/Mobile/HeaderBot';
import EditProfileModal from '../components/PopUp/EditProfileModal';

function Layout() {
    const [showEditModal, setShowEditModal] = useState(false);
    
    useEffect(() => {
        document.body.style.overflow = showEditModal ? 'hidden' : 'auto';
    }, [showEditModal]);

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
                    <Outlet context={{ setShowEditModal }}/>
                </div>

                {/* Sidebar phải */}
                <div className="md:w-1/5 hidden md:block"></div>
            </div>

            {/* Header bottom (for mobile) */}
            <HeaderBotMB/>

            {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
        </div>
    )
}


export default Layout