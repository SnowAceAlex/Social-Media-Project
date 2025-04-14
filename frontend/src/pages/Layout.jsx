import React from 'react'
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import HeaderMB from '../components/Mobile/Header';
import HeaderBotMB from '../components/Mobile/HeaderBot';

function Layout() {
    return (
        <div className="w-full">
            {/* Header (for mobile) */}
            <HeaderMB/>

            <div className="md:flex dark:bg-dark">
                {/* Sidebar */}
                <Sidebar/>
                {/* Main */}
                <div className="flex-1 md:ml-[16.67%] mt-16 mb-14 md:mt-0 md:mb-0 min-h-screen
                                flex flex-col dark:bg-dark">
                    {/* <div className="h-28 "></div>
                    <div className="h-[42rem]"></div>
                    <div className="h-[42rem] "></div>
                    <div className="h-[42rem] "></div> */}
                    <Outlet/>
                </div>

                {/* Sidebar phải */}
                <div className="md:w-1/6 bg-green-400 hidden md:block"></div>
            </div>

            {/* Header bottom (for mobile) */}
            <HeaderBotMB/>
        </div>
    )
}


export default Layout