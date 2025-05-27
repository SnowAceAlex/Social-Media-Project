import { useEffect, useState, useRef, useCallback } from "react";
import fetchPost from "../services/fetchPost";

const useInfinitePosts = (userId = null, reloadPosts = false) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const observerRef = useRef();
    const prevUserIdRef = useRef(userId);

    const lastPostRef = useCallback(
        (node) => {
            if (loading) return;
    
            if (observerRef.current) observerRef.current.disconnect();
    
            observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev) => prev + 1);
            }
            });
    
            if (node) observerRef.current.observe(node);
    },
        [loading, hasMore]
    );

    useEffect(() => {
        const loadPosts = async () => {
            if (loading || !hasMore) return;
            setLoading(true);
            try {
            const data = await fetchPost(page, userId);
            if (data.posts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => {
                    const seen = new Set(prev.map((p) => p.id));
                    const newPosts = data.posts.filter((p) => !seen.has(p.id));
                    return [...prev, ...newPosts];
                    });
                }
            } catch (err) {
            console.error(err);
            } finally {
            setLoading(false);
            }
        };
        loadPosts();
    }, [page, userId]);

    useEffect(() => {
        if (prevUserIdRef.current !== userId) {
            setPosts([]);
            setPage(1);
            setHasMore(true);
            prevUserIdRef.current = userId;
        }
    }, [userId]);

    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
        const fetchFirstPage = async () => {
        try {
            const data = await fetchPost(1, userId);
            if (data.posts.length === 0) {
                setHasMore(false);
            } else {
                setPosts(data.posts);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchFirstPage();
    }, [userId, reloadPosts]);

    return { posts, loading, lastPostRef };
};

export default useInfinitePosts;