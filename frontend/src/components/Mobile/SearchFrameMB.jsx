import React from "react";
import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import useUserSearch from "../../hook/useUserSearch";
import SearchCard from "../SearchCard";
import SearchLoading from "../Skeleton/SearchLoading";

function SearchFrameMB({ searchValue, setSearchValue }) {
    const {results, loading, type} = useUserSearch(searchValue);

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search something..."
                className="w-full p-3 pr-10 rounded-lg border border-gray-300 dark:border-dark-border
                        bg-light-input dark:bg-dark-input focus:outline-none
                        dark:text-dark-text placeholder:dark:text-dark-input-disabled-text"
            />

            {searchValue && (
                <button
                    type="button"
                    onClick={() => setSearchValue("")}
                    className={`absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 rounded-full cursor-pointer
                        ${
                            loading
                                ? ""
                                : "bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover"
                        }`}
                >
                    {loading ? (
                        <img src="/assets/loading.gif" alt="loading" className="w-4 h-4" />
                    ) : (
                        <IoIosClose size={20} />
                    )}
                </button>
            )}

            {/* Dropdown with motion */}
            <AnimatePresence>
                {searchValue && (
                    <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 mt-2 w-full bg-light dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-border max-h-72 overflow-y-auto"
                    >
                        {loading ? (
                            <>
                                <SearchLoading />
                                <SearchLoading />
                                <SearchLoading />
                            </>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SearchFrameMB;
