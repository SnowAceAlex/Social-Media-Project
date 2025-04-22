import React, { useState, useMemo } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import FollowButton from "../FollowButton";
import SearchLoading from "../Skeleton/SearchLoading";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useProfilesList from "../../hook/useProfilesList";
import { getCurrentUser } from "../../helpers/getCurrentUser";

// Reaction map
const reactionMap = {
    like: { emoji: "❤️", label: "Like" },
    haha: { emoji: "😂", label: "Haha" },
    wow: { emoji: "😮", label: "Wow" },
    cry: { emoji: "😢", label: "Cry" },
    angry: { emoji: "😡", label: "Angry" },
};

const tabs = [
    { key: "all", label: "All" },
    ...Object.entries(reactionMap).map(([key, { emoji }]) => ({
        key,
        label: `${emoji}`,
    })),
];

const ReactUserModal = ({ reactUsers = [], onClose, title = "Reactions" }) => {
    const {currentUser} = getCurrentUser();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const userIds = useMemo(() => [...new Set(reactUsers.map((r) => r.user_id))], [reactUsers]);
    const { profiles, loading: loadingProfiles } = useProfilesList(userIds);

    // Filter theo tab và search
    const filteredUsers = useMemo(() => {
        return reactUsers.filter(({ user_id, reaction_type }) => {
            const profile = profiles[user_id]?.profile;
            if (!profile) return false;

            const matchTab = activeTab === "all" || reaction_type === activeTab;
            const search = searchTerm.toLowerCase();
            const matchSearch =
                profile.username?.toLowerCase().includes(search) ||
                profile.fullname?.toLowerCase().includes(search);

            return matchTab && matchSearch;
        });
    }, [reactUsers, profiles, searchTerm, activeTab]);

    return (
        <div className="fixed top-0 left-0 w-full h-full z-[99] bg-black/50 flex items-center justify-center dark:text-dark-text">
            <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-white dark:bg-dark p-6 w-[30rem] h-[62vh] max-h-[80vh] rounded-xl overflow-auto shadow-lg scrollbar-hidden"
            >
                {/* Header */}
                <div className="flex w-full items-center mb-4 relative">
                    <h2 className="text-xl font-bold dark:text-dark-text w-full text-center">{title}</h2>
                    <IoCloseOutline
                        size={28}
                        onClick={onClose}
                        title="Close"
                        className="p-1 bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text rounded-full cursor-pointer absolute right-0 top-1/2 -translate-y-1/2"
                    />
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-6 gap-2 mb-4 dark:text-dark-text text-black">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-3 py-1 text-sm rounded-full transition-all
                                ${activeTab === tab.key
                                    ? "bg-primary"
                                    : "bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text cursor-pointer"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search input */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search username or name..."
                        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:bg-dark-card dark:border-dark-border dark:text-dark-text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400"
                        >
                            <IoIosClose size={20} />
                        </button>
                    )}
                </div>

                {/* User list */}
                <div className="space-y-3">
                    {filteredUsers.map(({ user_id, reaction_type }) => {
                        const user = profiles[user_id];
                        const profile = user?.profile;
                        const emoji = reactionMap[reaction_type]?.emoji || "";

                        return (
                            <div key={user_id} className="relative flex items-center gap-3 py-2">
                                {loadingProfiles || user?.loading ? (
                                    <SearchLoading />
                                ) : profile ? (
                                    <>
                                        <Link to={`/profile/${profile.id}`} className="flex items-center gap-3 flex-1 group">
                                            <img
                                                src={profile.profile_pic_url || "/default-avatar.png"}
                                                alt="avatar"
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-medium group-hover:underline">{profile.username}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{profile.fullname}</div>
                                            </div>
                                        </Link>
                                        {
                                            currentUser && currentUser.user?.id !== profile.id && (
                                                <FollowButton targetUserId={user_id} right="right-0" />
                                        )}
                                    </>
                                ) : (
                                    <span className="text-red-400">Failed to load</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default ReactUserModal;
