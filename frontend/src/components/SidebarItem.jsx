
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, onClick, isCollapsed }) => {
    return (
        <div className={`flex items-center justify-start w-full h-fit gap-4
                        rounded-xl hover:bg-light-hover cursor-pointer
                        transition-all duration-200 ease-in-out
                        dark:hover:bg-dark-hover
                        ${label === "Search" && isCollapsed ? 
                                "border-2 border-dark-border dark:border-light-input-disabled-text py-2 px-3" : 
                                "py-2 px-4"}`}
                        onClick={onClick}>
            <Icon size={30} />
            <AnimatePresence>
                {!isCollapsed && (
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-[400] text-md"
                >
                    {label}
                </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SidebarItem;