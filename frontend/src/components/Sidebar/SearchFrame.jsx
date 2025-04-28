import React, { useState } from 'react';
import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import useMediaQuery from '../../hook/useMediaQuery';
import useUserSearch from '../../hook/useUserSearch';
import SearchLoading from '../Skeleton/SearchLoading';
import SearchCard from '../SearchCard';

function SearchFrame({ showSearchFrame, searchValue, setSearchValue}) {
    const {results, loading, type} = useUserSearch(searchValue);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <div>
        <AnimatePresence>
            {showSearchFrame && isDesktop && (
            <motion.div
                key="search-frame"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{
                duration: 0.3,
                ease: "easeOut",
                exit: { duration: 0.2, ease: "easeIn" }
                }}
                className="fixed top-0 left-20 h-screen w-96 rounded-4xl
                        bg-light dark:bg-dark z-40 border-r-1 border-light-border
                        dark:border-dark-border px-8 py-6"
            >
                <h1 className="text-2xl font-bold mb-12 dark:text-dark-text">Search</h1>
                <div className="relative w-full">
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search user..."
                    className="w-full p-3 pr-10 rounded-lg border border-gray-300 dark:border-dark-border
                            bg-light-input dark:bg-dark-input focus:outline-none
                            dark:text-dark-text placeholder:dark:text-dark-input-disabled-text"
                />

                {searchValue && (
                    <button
                    type="button"
                    onClick={() => setSearchValue('')}
                    className={
                        `absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 rounded-full cursor-pointer
                        ${loading ? "" : "bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover"}`
                    }
                    >
                    {
                        loading ? (
                            <img src="/assets/loading.gif" alt="loading" className="w-4 h-4" />
                        ) : (
                            <IoIosClose size={20} />
                        )
                    }
                    </button>
                )}
                </div>
                
                {/* RESULT */}
                <div className="mt-6 space-y-4">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-gray-500 mt-4"
                        >
                            <SearchLoading/>
                            <SearchLoading/>
                            <SearchLoading/>
                            <SearchLoading/>
                            <SearchLoading/>
                            <SearchLoading/>
                        </motion.div>
                    ) : results.length > 0 ? (
                        type==='user' 
                        ? results.map(user => (
                            <SearchCard key={user.id} user={user}/>
                        ))
                        : results.map(tag => (
                            <SearchCard key={tag.id} hashtag={tag} />
                        ))
                    ) : (
                        searchValue && (
                            <p className="text-sm text-gray-500 mt-4">No information found.</p>
                        )
                    )}
                </div>

            </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
}

export default SearchFrame;