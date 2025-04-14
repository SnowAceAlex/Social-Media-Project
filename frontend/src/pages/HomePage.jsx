import React, { useState } from "react";
import PostCard from "../components/PostCard";

function HomePage() {
    return (
    <div className="md:ml-16">
        <div className=" h-28 border"></div>
        <PostCard/>
        <PostCard/> 
        <PostCard/>
    </div>
    );
}

export default HomePage;
