import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { formatCaption } from '../utils/formatCaption';

const PostCaption = ({ caption }) => {
    if(!caption) return;
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    // Chiều cao tối đa của text box khi chưa mở rộng
    const maxHeight = '7.5rem';
    const captionRef = useRef(null);

    // Hàm kiểm tra xem văn bản có bị cắt hay không
    const checkOverflow = () => {
        if (captionRef.current) {
            setIsOverflowing(captionRef.current.scrollHeight > captionRef.current.clientHeight);
        }
    };

    // Kiểm tra độ tràn khi nội dung thay đổi
    useEffect(() => {
        checkOverflow();
    }, [caption]);

    return (
        <div className="pl-2 space-y-2 mb-4">
            <div
                ref={captionRef}
                className={`whitespace-pre-wrap transition-all break-words ${isExpanded ? '' : 'overflow-hidden'}`}                style={{
                    lineHeight: '1.5rem',
                    maxHeight: isExpanded ? 'none' : maxHeight,
                }}>
                {formatCaption(caption)}
            </div>

            {!isExpanded && isOverflowing && (
                <button
                    className="text-blue-500 dark:text-blue-400 cursor-pointer"
                    onClick={() => setIsExpanded(true)}
                >
                    More...
                </button>
            )}

            {isExpanded && (
                <button
                    className="text-blue-500 dark:text-blue-400 cursor-pointer"
                    onClick={() => setIsExpanded(false)}
                >
                    Show less
                </button>
            )}
        </div>
    );
};

export default PostCaption;
