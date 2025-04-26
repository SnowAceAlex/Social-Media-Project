import { motion, AnimatePresence } from 'framer-motion';

const loadingVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -30, opacity: 0 },
};

const LoadingModal = ({ show, onClose }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed top-6 left-1/2 -translate-x-1/2 p-2 rounded-full shadow-md z-[9999] 
                    flex items-center justify-center w-fit bg-white/30 dark:bg-dark-border/50"
                    variants={loadingVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <img src="/assets/loadingModal.gif" alt="Loading..." className="w-8 h-8" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingModal;

