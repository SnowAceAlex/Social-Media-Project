import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useProfile from "../../hook/useProfile";

const ReactUserList = ({ reactUsers }) => {
    const uniqueUserIds = useMemo(() => {
        if (!Array.isArray(reactUsers)) return [];
        return [...new Set(reactUsers.map(r => r.user_id))];
    }, [reactUsers]);

    return (
        <motion.div
            className="absolute bottom-full left-0 mt-1 bg-white dark:bg-dark-card shadow-lg p-3 z-50 w-36 max-h-60 overflow-y-auto text-sm
                        flex flex-col gap-2 items-start"
                        style={{ marginBottom: '20px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {uniqueUserIds.map((userId) => {
                const { profile, loading } = useProfile(userId);

                return (
                    <motion.div
                        key={userId}
                        className="flex items-center gap-2 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {loading ? (
                            <span className="text-gray-400">Loading...</span>
                        ) : profile ? (
                            <>
                                <Link to={`/profile/${profile.id}`} className="cursor-pointer flex items-center gap-2 group">
                                    <img
                                        src={profile.profile_pic_url || "/default-avatar.png"}
                                        alt="avatar"
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="group-hover:underline text-nowrap">{profile.username}</span>
                                </Link>
                            </>
                        ) : (
                            <span className="text-red-400">Failed to load</span>
                        )}
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default ReactUserList;