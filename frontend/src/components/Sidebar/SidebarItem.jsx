import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";
import { IoIosNotifications, IoIosNotificationsOutline} from "react-icons/io";


const SidebarItem = ({ icon: Icon, label, isCollapsed, to, onClick, isActive, hasNewNotification }) => {
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
            {
                label === "Home" && isActive ? (
                    <GoHomeFill size={30} />
                ) : label === "Notification" ? (
                    <div className="relative">
                        {isActive ? (
                            <IoIosNotifications size={30} />
                        ) : (
                            <IoIosNotificationsOutline size={30} />
                        )}
                        {hasNewNotification && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                    </div>
                ) : (
                    <Icon size={30} />
                )
            }

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