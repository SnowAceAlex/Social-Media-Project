import React from "react";
import { getCurrentUser } from "../helpers/getCurrentUser";
import useHomepagePost from "../hook/useHomePageFetch";
import Post from "../components/Post";
import PostLoading from "../components/Skeleton/PostLoading";
import FriendList from "../components/Homepage/FriendList";

function HomePage() {
    const { currentUser } = getCurrentUser();
    const { post, loading, error } = useHomepagePost(currentUser?.user?.id || null);

    return (
        <div className="flex w-full">    
            <div className="md:ml-16 lg:ml-0 lg:flex-5 flex-1 flex flex-col items-center">
                <div className="w-full h-28"></div>
                <div className="flex flex-col w-[30rem] md:w-[32rem] lg:w-[45rem]">
                    {loading ? (
                        <div className="py-2">
                            <PostLoading/>
                            <PostLoading/>
                        </div>
                    ) : (
                        post.map((item, index) => (
                            <div
                                key={index}
                                className="py-2 border-b-[1px] border-light-border dark:border-dark-border"
                            >
                            <Post key={item.post.id} post={item.post} profile={item.profile}/>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Sidebar phải */}
            <div className="lg:flex-2 hidden lg:block pr-8 min-w-[22rem]">
                <div className="w-full sticky top-10">
                    <FriendList/>
                </div>
            </div>
        </div>
    );
}

export default HomePage;