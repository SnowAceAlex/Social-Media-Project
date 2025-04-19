import React from "react";

function SearchCard({ user }) {
    if (!user) return null;

    return (
        <div
            key={user.id}
            className="flex items-center gap-3 py-2 px-4 rounded 
                    hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer"
        >
            <img
                src={user.profile_pic_url || "/default-avatar.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div>
                <div className="font-semibold text-black dark:text-dark-text">
                    {user.username}
                </div>
                <div className="text-sm text-gray-500">{user.full_name}</div>
            </div>
        </div>
    );
}

export default SearchCard;