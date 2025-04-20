import { useState, useEffect } from "react";
import { checkIfFollowing, followUser, getFollowCount, unfollowUser } from "../services/followService";

const useFollowStatus = (targetUserId, selfProfile) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followCount, setFollowCount] = useState({ followers: 0, following: 0 });

    useEffect(() => {
        if (!targetUserId) return;
        const fetchFollowCount = async () => {
            if(targetUserId){
                try {
                    const count = await getFollowCount(targetUserId);
                    setFollowCount(count);
                } catch (err) {
                    console.error("Error checking follow status:", err.message);
                }
            }
        }
        fetchFollowCount(); 
    }, [targetUserId])

    useEffect(() => {
        if (!targetUserId) return;
        const fetchFollowStatus = async () => {
        if (!selfProfile && targetUserId) {
            try {
            const status = await checkIfFollowing(targetUserId);
            setIsFollowing(status);
            } catch (err) {
            console.error("Error checking follow status:", err.message);
            }
        }
        };

        fetchFollowStatus();
    }, [targetUserId, selfProfile]);

    const toggleFollow = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(targetUserId);
                setIsFollowing(false);
            } else {
                await followUser(targetUserId);
                setIsFollowing(true);
            }
        } catch (err) {
        console.error("Follow/unfollow failed:", err.response?.data || err.message);
        }
    };



    return {followCount, isFollowing, toggleFollow };
};

export default useFollowStatus;