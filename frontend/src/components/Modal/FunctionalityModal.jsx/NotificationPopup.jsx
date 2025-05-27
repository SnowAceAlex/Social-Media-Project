import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../../contexts/NotificationContext";
import { useContext, useEffect } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function NotificationPopup() {
    const { notifications, removeNotification } = useNotifications();
    const latestNotification = notifications[0] || null;
    const { isDark } = useTheme();
    const imageSrc = isDark ? "/assets/notification_2.gif" : "/assets/notification_1.gif";

    useEffect(() => {
        if (!latestNotification) return;

        const timer = setTimeout(() => {
            removeNotification(latestNotification.id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [latestNotification, removeNotification]);

    return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[999]">
        <AnimatePresence>
            {latestNotification && (
                <motion.div
                    key={latestNotification.id}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 50 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-light-border dark:border-dark-input-border dark:bg-dark-card dark:text-white shadow-lg rounded-lg py-4 pl-2 pr-4 relative inline-block"
                    onClick={() => removeNotification(latestNotification.id)}
                    >
                    <div className="flex items-center">
                        <img src={imageSrc} className="w-10 aspect-square"/>
                            {
                            latestNotification.type === "follow" && (
                                <span className="flex gap-2 text-nowrap">
                                    <span className="font-bold">{latestNotification.username}</span> 
                                    just followed you!
                                </span>                                
                            ) 
                            }
                            {
                            latestNotification.type === "comment" && (
                                <span className="flex gap-2 text-nowrap">
                                    <span className="font-bold">{latestNotification.username}</span> 
                                    just commented on your post!
                                </span>                                
                            ) 
                            }
                            {
                            latestNotification.type !== "follow" && latestNotification.type !== "comment" && (
                                <span className="flex gap-2 text-nowrap">
                                You have a new reaction on your post!
                                </span>  
                            )
                            }
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
    
    );
}

// Bước 1: removeNotification được gọi sau 3 giây

// Bước 2: Notification bị xóa khỏi context → latestNotification trở thành null

// Bước 3: Điều kiện render trả về false → bắt đầu quá trình unmount

// Bước 4: AnimatePresence thấy component sắp unmount → chạy animation exit

// Bước 5: Sau khi animation hoàn tất → component bị remove khỏi DOM