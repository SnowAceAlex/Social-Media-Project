import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { motion } from "framer-motion";

function LogInPage() {
    const images = [
        "https://images.unsplash.com/photo-1577080353772-1e76f4de0627?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU5fHxoYXBweXxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1740520224737-9838d33c2fb2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMzJ8fHxlbnwwfHx8fHw%3D",
        "https://images.unsplash.com/photo-1741289512974-4c2ad13598e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1741290606057-dfae12914684?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D",
    ];

    const caption = [
        "Sharing pure joy with my little one-laughter!",
        "Lost in the beauty of the mountains, with my best companion by my side",
        "I love the vibrant colors and fresh scents of these gorgeous tulips!",
        "Art, personality, and a touch of rebellion."
    ]

    const [showRegister, setShowRegister] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000); 
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className='flex bg-[#ffffff] h-screen w-screen overflow-hidden'>
            <div className=' hidden  md:flex-1 bg-[url("/assets/background.png")]
                            bg-cover bg-center bg-no-repeat 
                            md:flex justify-center items-center'>
                <div className="relative h-[90%] w-[70%] bg-white rounded-3xl overflow-hidden shadow-lg">
                    <img
                        src={images[currentIndex]}
                        alt="carousel"
                        className="w-full h-full object-cover transition-all duration-500"
                    />

                    <div className='absolute h-60 w-full bottom-0 p-8
                                    bg-gradient-to-t from-gray-900 to-transparent
                                    flex items-end'>
                        <p className='text-white w-[80%] font-bold text-2xl '>
                            {caption[currentIndex]}
                        </p>
                    </div>

                    <div className="absolute bottom-4 right-4 flex gap-2 z-99">
                        {images.map((_, index) => (
                        <div
                            key={index}
                            className={
                                `h-2 transition-all rounded-full 
                                ${
                                    currentIndex === index ? "w-6 bg-[#F77737]" : "w-2 bg-[#F77737]"
                                }`
                            }
                        ></div>
                        ))}
                    </div>
                </div>
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
                    <div>
                        <form className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Username or email"
                                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-[#e8f0fe] text-[#1B1B1B]
                                focus:ring-2 focus:ring-[#E1306C] focus:border-[#F77737] outline-none placeholder-gray-400"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-md bg-[#e8f0fe] text-[#1B1B1B]
                                focus:ring-2 focus:ring-[#E1306C] focus:border-[#F77737] outline-none placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4]  
                                text-white py-2 rounded-lg font-semibold
                                hover:bg-gradient-to-bl transition-all duration-500 ease-in-out cursor-pointer"
                            >
                                Log in
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <a href="#" className="text-sm text-blue-400 hover:underline font-medium">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    {/* SIGN UP FORM */}
                    <motion.div
                        animate={{
                            top: showRegister ? "35%" : "91%",
                            height: showRegister ? "30rem" : "5rem",
                            width: showRegister ? "25rem" : "20rem"
                        }}
                        transition={{ 
                            type: "tween", duration: 0.5, ease: "easeInOut" 
                        }}
                        className={`absolute left-1/2 -translate-x-1/2 p-4
                                rounded-t-3xl bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4] 
                                flex flex-col justify-start items-center text-white font-medium 
                                ${showRegister ? "rounded-b-3xl" : ""}`}
                    >
                        
                        <div onClick={() => setShowRegister(!showRegister)} 
                            className='flex flex-col justify-center items-center cursor-pointer'>
                            {showRegister ? <FaAngleDown /> : <FaAngleUp />}
                            <p >{showRegister ? "Click here to login!" : "Click here to register!"}</p>
                        </div>
                        {showRegister &&
                            <div className='mt-8'>
                                <form className="flex flex-col gap-4">
                                    <input 
                                        type='text'
                                        placeholder='Username'
                                        className='w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                outline-none placeholder-gray-200/50'
                                    />
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                outline-none placeholder-gray-200/50"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                outline-none placeholder-gray-200/50"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm password"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                outline-none placeholder-gray-200/50"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full text-[#e75982] py-2 rounded-lg font-semibold
                                        bg-white mt-8 hover:bg-gray-200
                                        transition-all duration-300 cursor-pointer"
                                    >
                                        Sign Up
                                    </button>
                                </form>
                            </div>
                        }
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default LogInPage
