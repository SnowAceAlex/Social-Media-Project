import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderMB from '../components/Mobile/Header';
import HeaderBotMB from '../components/Mobile/HeaderBot';
import EditProfileModal from '../components/Modal/EditProfileModal';
import CreatePostModal from '../components/Modal/CreatePostModal';
import DisplayFollowListModal from '../components/Modal/ShowFollowListModal';
import LoadingModal from '../components/Modal/FunctionalityModal.jsx/LoadingModal';
import AlertToast from '../components/Modal/FunctionalityModal.jsx/AlertModel';
import NotificationPopup from '../components/Modal/FunctionalityModal.jsx/NotificationPopup';
import HeaderNotification from '../components/Mobile/HeaderNotification';

function Layout() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const location = useLocation();
    const isNotificationPage = location.pathname === "/notification";
    const isMessagePage = location.pathname.startsWith("/conversation")

    useEffect(() => {
        document.body.style.overflow = showEditModal ? 'hidden' : 'auto';
    }, [showEditModal]);

    useEffect(() => {
        document.body.style.overflow = showCreatePostModal ? 'hidden' : 'auto';
    }
    , [showCreatePostModal]);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('error');

    const showGlobalToast = (message, type = 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const [showLoading, setShowLoading] = useState(false);
    const [reloadPosts, setReloadPosts] = useState(false);
    return (
        <div className="w-full relative min-h-screen bg-white dark:bg-dark">
            {/* Header (for mobile) */}
            {
                isNotificationPage ? (
                    <HeaderNotification/>
                ) : (
                    <HeaderMB searchValue={searchValue} setSearchValue={setSearchValue}/>
                )
            }
            <div className="md:flex dark:bg-dark">
                {/* Sidebar */}
                <Sidebar searchValue={searchValue} setSearchValue={setSearchValue}/>
                {/* Main */}
                <div className={`flex-1 ${isMessagePage ? "md:ml-[5.5%]" : "md:ml-[16.67%]"} mt-16 mb-14 md:mt-0 md:mb-0
                                flex flex-col dark:bg-dark `}
                                >
                    {/* <div className="h-28 "></div>
                    <div className="h-[42rem]"></div>
                    <div className="h-[42rem] "></div>
                    <div className="h-[42rem] "></div> */}
                    <Outlet context={{ setShowEditModal, setShowCreatePostModal, showGlobalToast, setShowLoading, reloadPosts, setReloadPosts }}/>
                </div>
            </div>

            {/* Header bottom (for mobile) */}
            <HeaderBotMB/>

            {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} showGlobalToast={showGlobalToast} setShowLoading={setShowLoading} />}
            {showCreatePostModal && 
                <CreatePostModal 
                onClose={() => setShowCreatePostModal(false)} 
                showGlobalToast={showGlobalToast}  
                setShowLoading={setShowLoading}
                onPostCreated={() => setReloadPosts(prev => !prev)}/>}
            
            <NotificationPopup/>

            <AlertToast
                show={showToast}
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
            
            <LoadingModal
                show={showLoading}
                onClose={() => setShowLoading(false)}
            />
        </div>
    )
}

export default Layout