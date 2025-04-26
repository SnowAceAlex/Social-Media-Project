// hooks/useUserSearch.js
import { useState, useEffect } from 'react';
import { searchHashtagsService, searchUsersService } from '../services/searchService';

const useUserSearch = (searchValue) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("user");

    useEffect(() => {
        if (!searchValue.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true); 

        const debounce = setTimeout(async () => {
            try {
                if (searchValue.startsWith('#')) {
                    const keyword = searchValue.slice(1);
                    const data = await searchHashtagsService(keyword);
                    setResults(data);
                    setType('hashtag');
                }else{
                    const data = await searchUsersService(searchValue);
                    setResults(data);
                    setType('user');
                }
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300); //debounce 300ms

        return () => clearTimeout(debounce);
    }, [searchValue]);

    return { results, loading, type };
};

export default useUserSearch;