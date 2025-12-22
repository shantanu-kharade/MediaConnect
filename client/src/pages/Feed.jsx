import React, { useState } from 'react'
import Layout from "../components/layout/Layout.jsx";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard.jsx";
import { PlusSquare, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import SuggestedUsers from '../components/SuggestedUserCard.jsx';
import { useAuth } from "../context/AuthContext.jsx";
import { usePosts } from "../hooks/usePosts.js";


const Feed = () => {
    const { user } = useAuth();
    const userProfile = user?.profile || {};
    const [activeTab, setActiveTab] = useState("all");
    
    // Fetch posts

    const { data: allPosts = [], isLoading: postsLoading } = usePosts();
    
    // Filter posts based on active tab - all shows all posts
    const filteredPosts = activeTab === "all" ? allPosts : allPosts.filter(post => {
        const postUserId = typeof post.userId === 'object' ? post.userId._id : post.userId;
        return user?.following?.includes(postUserId);
    });

    

    return (
        <Layout>
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Feed */}
                    <div className="lg:col-span-2">
                        {/* Create Post Prompt */}
                        <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-elegant">
                            <img
                                src={userProfile.avatar || "https://via.placeholder.com/48"}
                                alt="Your avatar"
                                className="h-12 w-12 rounded-full object-cover"
                            />
                            <Link
                                to="/create-post"
                                className="flex-1 rounded-lg bg-secondary px-4 py-3 text-muted-foreground transition-colors hover:bg-muted"
                            >
                                What's on your mind?
                            </Link>
                            <Button variant="gold" size="icon" asChild>
                                <Link to="/create-post">
                                    <PlusSquare className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>

                        {/* Feed Tabs */}
                        <div className="mb-6 flex gap-2 border-b border-border">
                            <button 
                                onClick={() => setActiveTab("all")}
                                className={`border-b-2 px-4 py-3 font-medium transition-colors ${
                                    activeTab === "all" 
                                        ? "border-gold text-foreground" 
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                For You
                            </button>
                            <button 
                                onClick={() => setActiveTab("following")}
                                className={`border-b-2 px-4 py-3 font-medium transition-colors ${
                                    activeTab === "following" 
                                        ? "border-gold text-foreground" 
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Following
                            </button>
                        </div>

                        {/* Posts */}
                        <div className="space-y-6">
                            {postsLoading ? (
                                <div className="flex justify-center py-16">
                                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                                </div>
                            ) : filteredPosts.length > 0 ? (
                                filteredPosts.map((post, index) => (
                                    <PostCard key={post._id} post={post} index={index} />
                                ))
                            ) : (
                                <div className="py-16 text-center">
                                    <p className="text-muted-foreground">No posts to show</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            {/* User Card */}
                            <div className="rounded-xl border border-border bg-card p-5 shadow-elegant">
                                <Link to="/profile" className="flex items-center gap-4">
                                    <img
                                        src={userProfile.avatar || "https://via.placeholder.com/150"} 
                                        alt={userProfile.firstName || "User Avatar" }
                                        className="h-14 w-14 rounded-full border-2 border-gold object-cover"
                                    />
                                    <div>
                                        <h3 className="font-display font-semibold text-foreground">
                                            {userProfile.firstName || "First"} {userProfile.lastName || "Last"}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            @{user?.username || "username"}
                                        </p>
                                    </div>
                                </Link>
                                <div className="mt-4 flex justify-between border-t border-border pt-4 text-center">
                                    <div>
                                        <p className="font-display font-bold text-foreground">
                                            {allPosts.filter(p => {
                                                const pid = typeof p.userId === 'object' ? p.userId._id : p.userId;
                                                const uid = user?._id || user?.id;
                                                return String(pid) === String(uid);
                                            }).length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Posts</p>
                                    </div>
                                    <div>
                                        <p className="font-display font-bold text-foreground">
                                            {user?.followerCount || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Followers</p>
                                    </div>
                                    <div>
                                        <p className="font-display font-bold text-foreground">
                                            {user?.followingCount || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Following</p>
                                    </div>
                                </div>
                            </div>

                            {/* Suggested Users */}
                            <SuggestedUsers />

                            {/* Footer */}
                            <div className="text-xs text-muted-foreground">
                                <div className="flex flex-wrap gap-2">
                                    <a href="#" className="hover:underline">About</a>
                                    <span>·</span>
                                    <a href="#" className="hover:underline">Help</a>
                                    <span>·</span>
                                    <a href="#" className="hover:underline">Privacy</a>
                                    <span>·</span>
                                    <a href="#" className="hover:underline">Terms</a>
                                </div>
                                <p className="mt-2">© 2025 media-connect</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Feed