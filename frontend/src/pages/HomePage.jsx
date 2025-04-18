import React, { useState } from "react";
import PostCard from "../components/PostCard";

function HomePage() {
    return (
    <div className="flex w-full border">    
        <div className="md:ml-16 lg:ml-0 lg:flex-3 flex-1">
            <div className=" h-28 border"></div>
            <PostCard/>
            <PostCard/> 
            <PostCard/>
        </div>
        
        {/* Sidebar phải */}
        <div className="lg:flex-1 hidden lg:block border"></div>
    </div>
    );
}

export default HomePage;
