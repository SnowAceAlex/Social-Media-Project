import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import Carousel from '../components/Carousel';
import LogInForm from '../components/Form/LogInForm';
import SignUpForm from '../components/Form/SignUpForm';

function LogInPage() {
    const [showRegister, setShowRegister] = useState(false);
    
    return (
        <div className='flex bg-[#ffffff] h-screen w-screen overflow-hidden'>
            <div className=' hidden  md:flex-1 bg-[url("/assets/background.png")]
                            bg-cover bg-center bg-no-repeat 
                            md:flex justify-center items-center'>
                <Carousel/>
            </div>
            <div className='relative flex-1 bg-[url("assets/background.png")] md:!bg-none md:bg-white]
                            flex justify-center items-center min-h-screen'>
                <div className="p-8 rounded-2xl w-96 text-[#1B1B1B]">
                    <motion.div
                        animate={{ y: showRegister ? "-10vh" : "0%" }}
                        transition={{  type: "tween", duration: 0.5, ease: "easeInOut"  }}
                        className="text-center mb-6 flex flex-col gap-2"
                    >
                        <span className="text-5xl font-norican-regular">Instagram</span>
                        <span className="text-xl">Discover the world through photos and stories!</span>
                    </motion.div>
                    {/* LOG IN FORM */}
                    <LogInForm/>
                    {/* SIGN UP FORM */}
                    <SignUpForm showRegister={showRegister} setShowRegister={setShowRegister}/>
                </div>
            </div>
        </div>
    )
}

export default LogInPage
