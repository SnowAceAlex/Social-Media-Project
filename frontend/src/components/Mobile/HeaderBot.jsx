import React from 'react'
import { MdHomeFilled } from "react-icons/md";

function HeaderBotMB() {
    return (
        <div className="w-full h-14 fixed bottom-0 left-0 bg-light z-50 md:hidden
                        flex items-center justify-between px-4 border-t-2 border-gray-200
                        ">
            <MdHomeFilled 
                title="Home"
                size={33} 
                className='text-black cursor-pointer'/>
        </div>
    )
}

export default HeaderBotMB
