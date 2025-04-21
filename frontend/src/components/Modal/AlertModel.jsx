import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { BiError } from "react-icons/bi";
import { TiTick } from "react-icons/ti";

const toastVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0 },
};

const AlertToast = ({ message, type = "error", show, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [show, onClose, duration]);

    const config = {
        success: {
            bg: "bg-[#e6f4ea]",
            text: "text-[#28a745]",
            icon: <TiTick className="mr-2 text-[#28a745]" size={20} />,
        },
        error: {
            bg: "bg-[#fce8e6]",
            text: "text-[#f02849]",
            icon: <BiError className="mr-2 text-[#f02849]" size={20} />,
        }
    };

    const current = config[type] || config.error;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={`fixed top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md shadow-md 
                                text-sm font-medium flex items-center border border-gray-200
                                dark:bg-dark-card dark:text-dark-text dark:border-dark-card-border
                                ${current.bg} ${current.text} z-[9999]`}
                    variants={toastVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {current.icon}
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertToast;
