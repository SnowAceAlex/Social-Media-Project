import React, { useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { RiNotification4Line } from "react-icons/ri";
import SearchFrameMB from './SearchFrameMB';

function HeaderMB({ searchValue, setSearchValue }) {
    return (
        <div
        className="w-full h-16 fixed top-0 left-0 bg-light z-50 md:hidden
                            dark:bg-dark dark:text-dark-text
                            flex items-center justify-between px-4"
        >
        <span className="font-norican-regular text-3xl mr-6">Instagram</span>
        <div className="flex items-center gap-4 flex-1">
            <SearchFrameMB searchValue={searchValue} setSearchValue={setSearchValue}/>
            <RiNotification4Line
                size={30}
                className="cursor-pointer"
                title="Notification"
            />
        </div>
        </div>
    );
}

export default HeaderMB;
