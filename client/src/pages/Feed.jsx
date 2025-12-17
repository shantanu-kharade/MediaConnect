import React from 'react'
import Layout from "../components/layout/Layout.jsx";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard.jsx";
import { PlusSquare } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import SuggestedUsers from '../components/SuggestedUserCard.jsx';
const Feed = () => {
    const { user } = {}; //fetch user data from context or api
    return (
        <Layout>
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Feed */}
                    <div className="lg:col-span-2">
                        {/* Create Post Prompt */}
                        <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-elegant">
                            <img
                                src={user?.avatar}
                                alt="Your avatar"
                                className="h-12 w-12 rounded-full object-cover"
                            />
                            <Link
                                to="/create"
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
                            <button className="border-b-2 border-gold px-4 py-3 font-medium text-foreground">
                                For You
                            </button>
                            <button className="border-b-2 border-transparent px-4 py-3 text-muted-foreground transition-colors hover:text-foreground">
                                Following
                            </button>
                            <button className="border-b-2 border-transparent px-4 py-3 text-muted-foreground transition-colors hover:text-foreground">
                                Trending
                            </button>
                        </div>

                        {/* Posts */}
                        <div className="space-y-6">
                            
                                <PostCard key={1} post={"hello there"} />
                        
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            {/* User Card */}
                            <div className="rounded-xl border border-border bg-card p-5 shadow-elegant">
                                <Link to="/profile" className="flex items-center gap-4">
                                    <img
                                        src={user?.avatar || "https://via.placeholder.com/150"} 
                                        alt={user?.displayName || "User Avatar" }
                                        className="h-14 w-14 rounded-full border-2 border-gold object-cover"
                                    />
                                    <div>
                                        <h3 className="font-display font-semibold text-foreground">
                                            {user?.displayName || "Name"}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            @{user?.username || "username"}
                                        </p>
                                    </div>
                                </Link>
                                <div className="mt-4 flex justify-between border-t border-border pt-4 text-center">
                                    <div>
                                        <p className="font-display font-bold text-foreground">
                                            22
                                        </p>
                                        <p className="text-xs text-muted-foreground">Posts</p>
                                    </div>
                                    <div>
                                        <p className="font-display font-bold text-foreground">
                                            1.4k
                                        </p>
                                        <p className="text-xs text-muted-foreground">Followers</p>
                                    </div>
                                    <div>
                                        <p className="font-display font-bold text-foreground">
                                            3.5k
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