import React, { useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { RiNotification4Line } from "react-icons/ri";

function HeaderMB() {
    const [searchValue, setSearchValue] = useState('');
    return (
        <div
        className="w-full h-16 fixed top-0 left-0 bg-light z-50 md:hidden
                            dark:bg-dark dark:text-dark-text
                            flex items-center justify-between px-4"
        >
        <span className="font-norican-regular text-3xl mr-6">Instagram</span>
        <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search something..."
                className="w-full p-3 pr-10 rounded-lg border border-gray-300 dark:border-dark-border
                                                bg-light-input dark:bg-dark-input focus:outline-none
                                                dark:text-dark-text placeholder:dark:text-dark-input-disabled-text"
            />

            {searchValue && (
                <button
                type="button"
                onClick={() => setSearchValue("")}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 rounded-full cursor-pointer
                                                    bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover"
                >
                <IoIosClose size={20} />
                </button>
            )}
            </div>
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
