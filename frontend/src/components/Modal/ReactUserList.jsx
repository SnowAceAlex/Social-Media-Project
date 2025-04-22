import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useProfile from "../../hook/useProfile";

const reactionMap = {
    like: "❤️",
    haha: "😂",
    wow: "😮",
    cry: "😢",
    angry: "😡",
};

const ReactUserList = ({ reactUsers }) => {
    const uniqueReactUsers = useMemo(() => {
        if (!Array.isArray(reactUsers)) return [];
        const seen = new Set();
        return reactUsers.filter(r => {
            if (seen.has(r.user_id)) return false;
            seen.add(r.user_id);
            return true;
        });
    }, [reactUsers]);

    if (uniqueReactUsers.length === 0) return null;

    return (
        <motion.div
            className="absolute bottom-full left-0 mt-1 bg-white dark:bg-dark-card shadow-lg p-3 z-50 w-40 max-h-60 overflow-y-auto text-sm
                        flex flex-col gap-2 items-start"
            style={{ marginBottom: '20px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {uniqueReactUsers.map(({ user_id, reaction_type }) => {
                const { profile, loading } = useProfile(user_id);
                const emoji = reactionMap[reaction_type] || "";

                return (
                    <motion.div
                        key={user_id}
                        className="flex items-center gap-2 mb-2 w-full justify-between"
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
                            <span>{emoji}</span>
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