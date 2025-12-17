import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import ProfileHeader from "../components/ProfileHeader.jsx";
import PostCard from "../components/PostCard.jsx";

import { Grid3X3, Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils.js";

const Profile = () => {
    const { userId } = useParams();
    const [activeTab, setActiveTab] = useState("posts");
    const posts = []
    const users = {}

    const user = userId
        ? users.find((u) => u.id === userId) || "currentUser"
        : "currentUser";

    const isOwnProfile = !userId || userId === "";

    // Filter posts by user
    const userPosts = posts.filter((post) => post.author.id === user.id);

    const tabs = [
        { id: "posts", label: "Posts", icon: Grid3X3 },
        { id: "saved", label: "Saved", icon: Bookmark },
        { id: "liked", label: "Liked", icon: Heart },
    ];

    return (
        <Layout>
            <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Tabs */}
                <div className="mb-8 flex justify-center gap-8 border-b border-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors",
                                activeTab === tab.id
                                    ? "border-gold text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Posts Grid/List */}
                {activeTab === "posts" && (
                    <div className="space-y-6">
                        {userPosts.length > 0 ? (
                            userPosts.map((post, index) => (
                                <PostCard key={post.id} post={post} index={index} />
                            ))
                        ) : (
                            <div className="py-16 text-center">
                                <p className="text-muted-foreground">No posts yet</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "saved" && (
                    <div className="py-16 text-center">
                        <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                            Saved Posts
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                            Posts you save will appear here
                        </p>
                    </div>
                )}

                {activeTab === "liked" && (
                    <div className="py-16 text-center">
                        <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                            Liked Posts
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                            Posts you like will appear here
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Profile;