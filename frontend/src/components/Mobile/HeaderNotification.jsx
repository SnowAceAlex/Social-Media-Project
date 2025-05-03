import React from 'react'
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function HeaderNotification() {
    const navigate = useNavigate();

    return (
        <div
        className="w-full h-16 relative top-0 left-0 bg-light z-50 md:hidden
                            dark:bg-dark dark:text-dark-text
                            flex items-center justify-center px-4 border-b-2 border-light-border dark:border-dark-input"
        >
            <IoChevronBack
                size={32}
                className="cursor-pointer absolute top-1/2 -translate-y-1/2 left-5"
                onClick={() => navigate(-1)} 
            />
            <h1 className="text-2xl font-bold dark:text-dark-text">
                Notifications
            </h1>        
        </div>
    )
}

export default HeaderNotification
