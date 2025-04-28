import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, isCollapsed, to, onClick, isActive }) => {
    const baseClasses = `
        flex items-center justify-start w-full h-fit gap-4
        rounded-xl hover:bg-light-hover cursor-pointer
        transition-all duration-200 ease-in-out
        dark:hover:bg-dark-hover py-2 px-4
    `;

    const activeClasses = isActive
    ? label === "Search"
        ? "border-[1px] border-dark-border dark:border-light-input-disabled-text"
        : label === "Notification"
            ? "border-[1px] border-dark-border dark:border-light-input-disabled-text"
            : "font-bold bg-light-hover dark:bg-dark-hover"
    : "font-[400]";

    const classes = `${baseClasses} ${activeClasses}`;

    const content = (
        <>
            <Icon size={30} />
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-md"
                    >
                        {label}
                    </motion.p>
                )}
            </AnimatePresence>
        </>
    );

    if (to) {
        return (
            <Link to={to} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <div className={classes} onClick={onClick}>
            {content}
        </div>
    );
};

export default SidebarItem;