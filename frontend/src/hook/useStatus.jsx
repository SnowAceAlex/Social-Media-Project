import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { getOnOffStatus } from "../services/socketService.";

const useStatus = (friends = []) => {
    const { socket } = useSocket();
    //Initialize Map 
    const [statusMap, setStatusMap] = useState({}); // { userId: 'Online' | 'Offline' }

    useEffect(() => {
        if (!socket || !friends || friends.length === 0) return;

        const initStatus = async () => {
            const statuses = await Promise.all(
                friends.map(async (f) => {
                    try {
                        const res = await getOnOffStatus(f.id);
                        return { id: f.id, status: res.status };
                    } catch {
                        return { id: f.id, status: "Không rõ" };
                    }
                })
            );
            //Set to status map
            const map = {};
            statuses.forEach((s) => (map[s.id] = s.status));
            setStatusMap(map);
        };

        initStatus();

        const handleOnline = ({ userId }) => {
            setStatusMap((prev) => ({ ...prev, [userId]: "Online" }));
        };

        const handleOffline = ({ userId }) => {
            setStatusMap((prev) => ({ ...prev, [userId]: "Offline" }));
        };

        //HANDLE REAL TIME
        socket.on("user-online", handleOnline);
        socket.on("user-offline", handleOffline);

        return () => {
            socket.off("user-online", handleOnline);
            socket.off("user-offline", handleOffline);
        };
    }, [socket, friends]);

    return statusMap;
};

export default useStatus;