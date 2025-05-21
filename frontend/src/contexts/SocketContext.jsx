import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:3001", {
        withCredentials: true,
        autoConnect: true, 
        });

        setSocket(newSocket);

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
            setCurrentUser(null); 
        });

        newSocket.on("connect", () => {
            if (!currentUser) {
                const stored = sessionStorage.getItem("currentUser");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed?.user?.id) {
                        console.log("🔁 Auto rejoin room:", parsed.user.id);
                        newSocket.emit("join", parsed.user.id, (res) => {
                            if (res?.success) {
                                setCurrentUser(parsed.user);
                                console.log("✅ Auto rejoined after reload");
                            } else {
                                console.error("❌ Auto rejoin failed");
                            }
                        });
                    }
                }
            }
        })

        return () => {
        newSocket.disconnect();
        };
    }, []);

    const login = useCallback(async (userData) => {
        if (!socket) return;
        
        try {
        if (!socket.connected) {
            await new Promise((resolve) => {
            socket.connect();
            socket.once("connect", resolve);
            });
        }

        if (currentUser) {
            socket.emit("leave", currentUser.id);
        }
        
        await new Promise((resolve, reject) => {
            socket.emit("join", userData.id, (response) => {
            if (response?.success) {
                setCurrentUser(userData); 
                resolve();
            } else {
                reject(new Error("Join room failed"));
            }
            });
        });
        } catch (error) {
        console.error("Login error:", error);
        throw error;
        }
    }, [socket, currentUser]);

    const logout = useCallback(async() => {
        console.log(currentUser);

        if (!socket || !currentUser) return;

        socket.emit("leave", currentUser.id);
        setCurrentUser(null); 
        await socket.disconnect();
    }, [socket, currentUser]);

    const value = {
        socket,
        currentUser,
        login,
        logout,
        isConnected: socket?.connected || false,
        currentRoom,
        setCurrentRoom
    };

    return (
        <SocketContext.Provider value={value}>
        {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);