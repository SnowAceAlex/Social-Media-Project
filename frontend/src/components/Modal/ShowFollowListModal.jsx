import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import useFollowers from "../../hook/useFollower";
import useFollowing from "../../hook/useFollowing";
import FollowButton from "../FollowButton";
import SearchLoading from "../Skeleton/SearchLoading";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion'; 

const DisplayFollowListModal = ({
    title,
    userId,
    followListType,
    onClose
    }) => {
    const {
        followers,
        isLoading: loadingFollowers,
        error: errorFollowers,
    } = useFollowers(followListType === "followers" ? userId : null);

    const {
        following,
        isLoading: loadingFollowing,
        error: errorFollowing,
    } = useFollowing(followListType === "following" ? userId : null);

    const loading =
        followListType === "followers" ? loadingFollowers : loadingFollowing;
    const error =
        followListType === "followers" ? errorFollowers : errorFollowing;
    const users = Array.isArray(
        followListType === "followers" ? followers : following
    )
        ? followListType === "followers"
        ? followers
        : following
        : [];

    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(
        (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed top-0 left-0 w-full h-full z-[99] bg-black/50 flex items-center justify-center dark:text-dark-text">
        <motion.div 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white dark:bg-dark p-6 w-[30rem] rounded-xl overflow-auto shadow-lg">
            <div className="flex w-full items-center mb-4 relative">
                <h2 className="text-xl font-bold dark:text-dark-text w-full text-center">{title}</h2>
                <IoCloseOutline
                    size={28}
                    onClick={onClose}
                    title="Close"
                    className="p-1 bg-light-button hover:bg-light-button-hover
                        dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text
                        rounded-full cursor-pointer absolute right-0 top-1/2 -translate-y-1/2"
                />
            </div>

            {/* Search input */}
            <div className="relative">
            <input
                type="text"
                placeholder="Search username or name..."
                className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 dark:bg-dark-card dark:border-dark-border dark:text-dark-text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <button
                type="button"
                onClick={() => setSearchTerm("")}
                className={`absolute top-1/2 right-3 transform -translate-y-[1rem] text-gray-400 rounded-full cursor-pointer
                    ${loading ? "" 
                        : "bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover"}`}>
                {loading ? (
                    <img
                    src="/assets/loading.gif"
                    alt="loading"
                    className="w-4 h-4"
                    />
                ) : (
                    <IoIosClose size={20} />
                )}
                </button>
            )}
            </div>

            <div className="space-y-3 h-60 max-h-[60vh] overflow-y-auto">
            {loading ? (
                <>
                <SearchLoading />
                <SearchLoading />
                <SearchLoading />
                </>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : filteredUsers.length === 0 ? (
                <p className="text-gray-500 dark:text-dark-text-subtle">
                No users found.
                </p>
            ) : (
                filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 relative">
                    <Link className="flex gap-4" to={`/profile/${user.id}`} onClick={onClose} title={user.username}>
                        <img
                        src={user.profile_pic_url}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-gray-500 w-44 truncate"
                                title={user.full_name}>{user.full_name}</div>
                        </div>
                    </Link>
                    <FollowButton
                        targetUserId={user.id}
                        right="right-2"
                    />
                </div>
                ))
            )}
            </div>
        </motion.div>
        </div>
    );
};

export default DisplayFollowListModal;