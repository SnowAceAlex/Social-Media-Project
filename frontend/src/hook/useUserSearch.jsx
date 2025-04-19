// hooks/useUserSearch.js
import { useState, useEffect } from 'react';
import { searchUsersService } from '../services/searchService';

const useUserSearch = (searchValue) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchValue.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true); 

        const debounce = setTimeout(async () => {
            try {
                const data = await searchUsersService(searchValue);
                setResults(data);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300); //debounce 300ms

        return () => clearTimeout(debounce);
    }, [searchValue]);

    return { results, loading };
};

export default useUserSearch;