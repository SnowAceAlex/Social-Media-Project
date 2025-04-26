import React from "react";
import { GoHash } from "react-icons/go";
import { Link } from "react-router-dom";

function SearchCard({ user, hashtag }) {
    if (!user && !hashtag) return null;

    return (
        <Link
            to={user ? `/profile/${user.id}` : `/hashtag/${hashtag.name}/`}
            className="flex items-center gap-3 py-2 px-4 rounded 
                        hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer"
            >
            {
                user ? 
                <img
                src={user.profile_pic_url || "/default-avatar.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
                />
                : 
                <div className="w-10 h-10 text-black dark:text-white rounded-full flex items-center justify-center
                                border-[1px] border-light-input-border dark:border-dark-border">
                    <GoHash size={18}/>
                </div>
            }
            <div>
                <div className="font-semibold text-black dark:text-dark-text">
                    {user ? (user.username) : (hashtag.name)}
                </div>
                <div className="text-sm text-gray-500">
                    {user ? user.full_name : (hashtag.post_count + " posts")}
                </div>
            </div>
        </Link>
    );
}

export default SearchCard;