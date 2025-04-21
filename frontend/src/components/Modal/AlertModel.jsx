import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { BiError } from "react-icons/bi";
import { TiTick } from "react-icons/ti";

const toastVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
};

const AlertToast = ({ message, type = "error", show, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [show, onClose, duration]);

    const bgColor = {
        error: "bg-red-500",
        success: "bg-green-500",
    }[type] || "bg-gray-800";

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 
                                rounded-lg shadow-lg text-white z-[9999] flex items-center ${bgColor}`}
                    variants={toastVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit">
                        {type === "error" && <BiError className="inline-block mr-2" size={20} />}
                        {type === "success" && <TiTick className="inline-block mr-2" size={20} />}
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertToast;
