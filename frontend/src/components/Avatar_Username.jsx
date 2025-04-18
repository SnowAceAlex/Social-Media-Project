import React from "react";
import useProfile from "../hook/useProfile";
import { LuDot } from "react-icons/lu";
import { formatDistanceToNow } from 'date-fns';

function Avatar_Username({ profile = null, createdAt = null ,loading = false}) {
    return (
        <div className="flex gap-4 items-center dark:text-dark-text">
            <div className="w-14 aspect-square rounded-full border-4 border-white overflow-hidden bg-gray-300 dark:border-dark">
                {loading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse"></div>
                ) : (
                <img
                    src={profile?.profile_pic_url}
                    alt={profile?.username}
                    className="w-full h-full object-cover"
                />
                )}
            </div>
            <div className="flex">
                {profile ? (
                    <>
                    <span className="text-lg font-medium dark:text-dark-text">
                        {profile.username}
                    </span>
                    {
                        createdAt ? (
                            <>
                                <div className="flex items-center dark:text-dark-input-disabled-text text-light-input-disabled-text">
                                    <LuDot size={25} />
                                </div>
                                <span className=" dark:text-dark-input-disabled-text text-light-input-disabled-text">
                                    {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                                </span>
                            </>
                        ) : null
                    }
                    </>
                    ) : (
                    <div className="w-32 h-4 bg-gray-300 rounded animate-pulse" />
                )}
            </div>
        </div>
    );
}

export default Avatar_Username;
