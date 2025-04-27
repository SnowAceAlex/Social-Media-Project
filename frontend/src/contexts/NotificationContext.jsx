// NotificationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import { getCurrentUser } from "../helpers/getCurrentUser";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const {currentUser} = getCurrentUser();
    const {socket} = useSocket();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.on("new_notification", (data) => {
        console.log("New notification received:", data);
        setNotifications((prev) => [data, ...prev]);
        });

        return () => {
        socket.off("new_notification");
        };
    }, [socket]);

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, removeNotification }}>
        {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);