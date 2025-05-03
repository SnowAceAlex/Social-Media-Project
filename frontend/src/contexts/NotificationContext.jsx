// NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSocket } from "./SocketContext";
import { getCurrentUser } from "../helpers/getCurrentUser";
import { getNotifications } from "../services/notificationService";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { currentUser } = getCurrentUser();
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState([]);  // dùng cho pop up
    const [notificationHistory, setNotificationHistory] = useState([]); // dùng cho frame

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const markNotificationsAsSeen = () => {
        setHasNewNotification(false);
    };
    
    const fetchNotificationHistory = useCallback(async (currentPage = 1, isLoadMore = false) => {
        try {
            if (!isLoadMore) setLoading(true);
            const data = await getNotifications(currentPage);
            console.log("Fetched notifications:", data);
            if (currentPage === 1) {
                setNotificationHistory(data.notifications);
            } else {
                setNotificationHistory((prev) => [...prev, ...data.notifications]);
            }
            setHasMore(data.hasMore);
            setPage(currentPage);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            setError(err);
        } finally {
            if (!isLoadMore) setLoading(false);
        }
    }, []);   

    useEffect(() => {
        if (!socket) return;

        socket.on("new_notification", (data) => {
        console.log("New notification received:", data);
            setNotifications((prev) => [data, ...prev]);
            setHasNewNotification(true);
        });
        return () => {
        socket.off("new_notification");
        };
    }, [socket]);

    const removeNotification = (id) => {
        const notifToRemove = notifications.find((n) => n.id === id);
        if (!notifToRemove) return;
    
        // Thêm vào history
        setNotificationHistory((prevHistory) => [notifToRemove, ...prevHistory]);
    
        // Xóa khỏi notifications popup
        setNotifications((prev) => prev.filter((n) => n.id !== id));

    };    

    const loadMore = async () => {
        if (!hasMore || loadingMore) return;
        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            await fetchNotificationHistory(nextPage, true); // ✅ thêm true để báo đang loadMore
            setPage(nextPage);
        } finally {
            setLoadingMore(false);
        }
    };    

    return (
        <NotificationContext.Provider value={{
            notifications,         
            notificationHistory, 
            loading,
            error,
            hasMore,
            loadMore,
            loadingMore,
            fetchNotificationHistory,
            removeNotification,
            hasNewNotification,                 
            markNotificationsAsSeen  
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);