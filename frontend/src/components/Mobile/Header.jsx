import React from 'react'
import { RiNotification4Line } from "react-icons/ri";
import { GoSearch } from "react-icons/go";

function HeaderMB() {
    return (
        <div className="w-full h-16 fixed top-0 left-0 bg-light z-50 md:hidden
                    flex items-center justify-between px-4">
            <span className="font-norican-regular text-3xl mr-6">Instagram</span>
            <div className='flex items-center gap-4 flex-1'>
            <div className="relative w-full">
                <GoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-md bg-[#e8f0fe] text-[#1B1B1B]
                            focus:ring-2 focus:ring-[#E1306C] focus:border-[#F77737] outline-none placeholder-gray-400" 
                />
            </div>
            <RiNotification4Line size={30} className='cursor-pointer' title='Notification'/>
            </div>
        </div>
    )
}

export default HeaderMB
