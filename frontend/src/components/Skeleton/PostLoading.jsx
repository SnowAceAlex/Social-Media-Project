import React from 'react'

function PostLoading() {
    return (
    <div className="w-full pt-4 flex flex-col gap-4">
        <div className="w-full h-[10%] flex items-center px-4 gap-4">
            <div className="w-14 aspect-square rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="w-52 md:w-60 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="px-4 py-2 space-y-2">
            <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
    </div>
    )
}

export default PostLoading
