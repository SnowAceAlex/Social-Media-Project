import { useEffect, useState } from "react";
import { getFollowing } from "../services/followService";
import { fetchLatestPost } from "../services/fetchPost";
import { getProfile } from "../services/authService";
const useHomepagePost = (userId) => {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const loadPost = async () => {
            setLoading(true);
            setError(null);

            try {
                const followings = await getFollowing(userId);
                const latestPostsWithProfiles = await Promise.all(
                    followings.map(async (user) => {
                        const postRes = await fetchLatestPost(user.id);
                        if (!postRes?.data) return null;
                        
                        const profile = await getProfile(user.id);
                        return {
                            post: postRes.data,
                            profile,
                        };
                    })
                );

                const filtered = latestPostsWithProfiles
                .filter(item => item !== null)
                .sort((a, b) => new Date(b.post.created_at) - new Date(a.post.created_at));

                setPost(filtered);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [userId]);

    return { post, loading, error };
};

export default useHomepagePost;
