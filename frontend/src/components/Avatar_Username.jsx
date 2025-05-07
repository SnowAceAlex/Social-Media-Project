import React from "react";
import { LuDot } from "react-icons/lu";
import { formatDistanceToNow } from 'date-fns';
import { Link } from "react-router-dom";

function Avatar_Username({ profile = null, createdAt = null, loading = false, setShowCommentModal = false }) {
    const profileLink = `/profile/${profile?.id}`;

    return (
        <div className={`flex gap-4 items-center dark:text-dark-text w-full
                        ${setShowCommentModal && "cursor-pointer"}`}
            onClick={()=>setShowCommentModal(true)}>
            <Link to={profileLink} className="flex gap-4 items-center">
                <div className="w-10 aspect-square rounded-full overflow-hidden bg-gray-300">
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
                            {createdAt ? (
                                <>
                                    <div className="flex items-center dark:text-dark-input-disabled-text text-light-input-disabled-text">
                                        <LuDot size={25} />
                                    </div>
                                    <span className="dark:text-dark-input-disabled-text text-light-input-disabled-text">
                                        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                                    </span>
                                </>
                            ) : null}
                        </>
                    ) : (
                        <div className="w-32 h-4 bg-gray-300 rounded animate-pulse" />
                    )}
                </div>
            </Link>
        </div>
    );
}

export default Avatar_Username;
