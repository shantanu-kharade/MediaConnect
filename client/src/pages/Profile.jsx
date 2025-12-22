import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProfileHeader from "../components/ProfileHeader";
import PostCard from "../components/PostCard";
import { Grid3X3, Bookmark, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../hooks/useUsers";
import { usePosts } from "../hooks/usePosts.js";

const Profile = () => {
    const { userId } = useParams();
    const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = useState("posts");


    const isOwnProfile = !userId || userId === authUser?._id;


    const { data: fetchedUser, isLoading: userLoading } = useUser(
        isOwnProfile ? undefined : userId
    );

    // Fetch all posts
    const { data: allPosts, isLoading: postsLoading } = usePosts();

    // Determine which user to display
    const user = isOwnProfile ? authUser : fetchedUser;



    const targetUserId = user?._id || user?.id;

    const userPosts = allPosts?.filter((post) => {

        if (!post.userId || !targetUserId) return false;


        const postAuthorId = typeof post.userId === 'object'
            ? post.userId._id
            : post.userId;


        return String(postAuthorId) === String(targetUserId);
    }) || [];

    const profileData = {
        user: user || {},
        posts: userPosts,
        followers: user?.followers || [],
        following: user?.following || [],
        followerCount: user?.followerCount || 0,
        followingCount: user?.followingCount || 0,
    };

    const tabs = [
        { id: "posts", label: "Posts", icon: Grid3X3 },
        { id: "saved", label: "Saved", icon: Bookmark },
        { id: "liked", label: "Liked", icon: Heart },
    ];

    if (userLoading || (!isOwnProfile && !user)) {
        return (
            <Layout>
                <div className="flex min-h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                </div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="flex min-h-[50vh] items-center justify-center">
                    <p className="text-muted-foreground">User not found</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <ProfileHeader
                user={profileData.user}
                isOwnProfile={isOwnProfile}
                followers={profileData.followers}
                following={profileData.following}
                followerCount={profileData.followerCount}
                followingCount={profileData.followingCount}
                postsCount={profileData.posts.length}
            />

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
                        {postsLoading ? (
                            <div className="flex justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                            </div>
                        ) : userPosts.length > 0 ? (
                            userPosts.map((post, index) => (
                                <PostCard key={post._id} post={post} index={index} />
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