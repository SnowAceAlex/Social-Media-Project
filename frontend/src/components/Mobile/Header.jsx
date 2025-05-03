import React, { useEffect, useRef, useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { IoIosNotifications, IoIosNotificationsOutline} from "react-icons/io";
import SearchFrameMB from './SearchFrameMB';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

function HeaderMB({ searchValue, setSearchValue }) {
    const { markNotificationsAsSeen, hasNewNotification } = useNotifications();

    return (
        <div
        className="w-full h-16 fixed top-0 left-0 bg-light z-50 md:hidden
                            dark:bg-dark dark:text-dark-text
                            flex items-center justify-between px-4"
        >
            <span className="font-norican-regular text-3xl mr-6">Instagram</span>
            <div className="flex items-center gap-4 flex-1">
                <SearchFrameMB searchValue={searchValue} setSearchValue={setSearchValue}/>
                <Link to="/notification" className="relative cursor-pointer" onClick={()=>markNotificationsAsSeen()}>
                    <IoIosNotificationsOutline size={30} title="Notification" />
                    {
                        hasNewNotification && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                        )
                    }
                </Link>
            </div>
        </div>
    );
}

export default HeaderMB;
