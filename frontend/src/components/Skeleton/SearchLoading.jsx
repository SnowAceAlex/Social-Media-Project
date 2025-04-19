import React from 'react';

function SearchLoading() {
    return (
        <div className="flex items-center gap-3 py-2 px-4 rounded animate-pulse">
            <div className="w-10 h-10 rounded-full bg-light-skeleton-base dark:bg-dark-skeleton-base"></div>
            <div className="flex flex-col gap-2">
                <div className="w-32 h-4 bg-light-skeleton-base dark:bg-dark-skeleton-base rounded"></div>
                <div className="w-20 h-3 bg-light-skeleton-base dark:bg-dark-skeleton-base rounded"></div>
            </div>
        </div>
    );
}

export default SearchLoading;
