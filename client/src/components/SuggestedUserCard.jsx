import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button.jsx";
import { useFollowUser, useSuggestedUsers } from "../hooks/useUsers.js";

const SuggestedUsers = ({ isLoading: externalLoading = false }) => {
    const { mutate: followUser } = useFollowUser();
    
    // Fetch suggested users from backend API
    const { data: suggestedUsers = [], isLoading } = useSuggestedUsers(3);

    if (isLoading || externalLoading) {
        return (
            <div className="rounded-xl border border-border bg-card p-5 shadow-elegant">
                <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                    Suggested for you
                </h3>
                <p className="text-sm text-muted-foreground">Loading suggestions...</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-elegant">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                Suggested for you
            </h3>
            <div className="space-y-4">
                {suggestedUsers.length > 0 ? (
                    suggestedUsers.map((user) => (
                        <SuggestedUserCard 
                            key={user._id} 
                            user={user} 
                            onFollow={followUser}
                        />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No more suggestions</p>
                )}
            </div>
            {/* {suggestedUsers.length > 0 && (
                <Button variant="link" className="mt-4 w-full text-gold">
                    See all suggestions
                </Button>
            )} */}
        </div>
    );
};

const SuggestedUserCard = ({ user, onFollow }) => {
    const userProfile = user.profile || {};
    const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
    const [isPending, setIsPending] = useState(false);

    const handleFollow = async () => {
        setIsPending(true);
        try {
            onFollow(
                { userId: user._id, isFollowing },
                {
                    onSuccess: () => {
                        setIsFollowing(!isFollowing);
                        setIsPending(false);
                    },
                    onError: () => {
                        setIsPending(false);
                    },
                }
            );
        } catch (error) {
            setIsPending(false);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <Link to={`/profile/${user._id}`} className="flex items-center gap-3">
                <img
                    src={userProfile.avatar || "https://via.placeholder.com/40"}
                    alt={userProfile.firstName || "User"}
                    className="h-10 w-10 rounded-full object-cover"
                />
                <div className="overflow-hidden">
                    <p className="truncate font-medium text-foreground">
                        {userProfile.firstName} {userProfile.lastName}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                        @{user.username}
                    </p>
                </div>
            </Link>
            <Button
                variant={isFollowing ? "outline" : "gold"}
                size="sm"
                onClick={handleFollow}
                disabled={isPending}
            >
                {isPending ? "Loading..." : isFollowing ? "Following" : "Follow"}
            </Button>
        </div>
    );
};

export default SuggestedUsers;