import React, { useState } from 'react'

const PostCaption = ({ caption }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const maxLength = 300; // Độ dài cắt ngắn text
    const truncatedText = caption.length > maxLength ? caption.substring(0, maxLength) + '...' : caption;

    return (
        <div className="pl-2 space-y-2">
            <div
            className={`transition-all ${isExpanded ? '' : 'overflow-hidden'}`}
            style={{
                lineHeight: '1.5rem',
                maxHeight: isExpanded ? 'none' : '7.5rem', // Điều chỉnh chiều cao khi ẩn
            }}
            >
            {isExpanded ? caption : truncatedText}
            </div>
    
            {!isExpanded && caption.length > maxLength && (
            <button
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsExpanded(true)}
            >
                More...
            </button>
            )}
    
            {isExpanded && (
            <button
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsExpanded(false)}
            >
                Show less
            </button>
            )}
        </div>
    );
};

export default PostCaption
