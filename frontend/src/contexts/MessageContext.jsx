import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

const MessageContext = createContext();

export const MessageProvider = ({children}) =>{
    const {socket} = useSocket();
    const [message, setMessage] = useState([]);

    useEffect(()=>{
        if(!socket) return;

        socket.on("receiveMessage", (data) => {
            console.log("New message received:", data);
                setMessage((prev) => [data, ...prev]);
        });
        return () => {
        socket.off("receiveMessage");
        };
    }, [socket])

    const value = {
        message
    }

    return(
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    )
}