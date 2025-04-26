import { useEffect, useState } from "react"
import { getPostsByHashTags } from "../services/PostService";

export default function useHashTag(hashtag){
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=>{
        if(!hashtag) return;
        const fetchPost = async() => {
            setLoading(true);
            setError(null);

            try {
                const data = await getPostsByHashTags(hashtag);
                setPosts(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    },[hashtag])
    return { posts, loading, error };
};