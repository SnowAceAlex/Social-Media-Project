import React from "react";
import useFollowStatus from "../hook/useFollowStatus";

const FollowButton = ({ targetUserId, selfProfile, right}) => {
    const { isFollowing, toggleFollow } = useFollowStatus(targetUserId, selfProfile);

    if (selfProfile) return null;

    return (
        <div
        onClick={toggleFollow}
        className={`absolute ${right} bottom-0 px-8 py-2 rounded-lg text-base font-semibold
            dark:text-dark-text cursor-pointer
            ${isFollowing
            ? "border-2 border-light-border dark:border-dark-border"
            : "bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover"
            }`}
        >
        {isFollowing ? "Following" : "Follow"}
        </div>
    );
};

export default FollowButton;