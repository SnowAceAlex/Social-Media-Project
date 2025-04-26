import { useRef, useState, useEffect } from 'react';

export default function useDelayedHover(delay = 200) {
    const [isHovering, setIsHovering] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsHovering(false);
        }, delay);
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return { isHovering, handleMouseEnter, handleMouseLeave, setIsHovering };
}