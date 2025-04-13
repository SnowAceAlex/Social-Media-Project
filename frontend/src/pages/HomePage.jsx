import React, { useState } from "react";
import PostCard from "../components/PostCard";

function HomePage() {
    return (
    <>
        <div className="h-28 border"></div>
        <PostCard/>
        <PostCard/> 
        <PostCard/>
    </>
    );
}

export default HomePage;
