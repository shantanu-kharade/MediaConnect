import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button.jsx";

const SuggestedUsers = () => {
    const users = [
        {
            id: "1",
            displayName: "Name",
            avatar: "https://via.placeholder.com/150",
            followers: 1234,
            isFollowing: true,
        },
        {
            id: "2",
            displayName: "Name",
            avatar: "https://via.placeholder.com/150",
            followers: 1234,
            isFollowing: false,
        },]
    const suggestedUsers = users.filter((user) => user.id !== "1").slice(0, 4);

    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-elegant">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                Suggested for you
            </h3>
            <div className="space-y-4">
                {suggestedUsers.map((user) => (
                    <SuggestedUserCard key={user.id} user={user} />
                ))}
            </div>
            <Button variant="link" className="mt-4 w-full text-gold">
                See all suggestions
            </Button>
        </div>
    );
};

const SuggestedUserCard = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);

    return (
        <div className="flex items-center justify-between">
            <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
                <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="h-10 w-10 rounded-full object-cover"
                />
                <div className="overflow-hidden">
                    <p className="truncate font-medium text-foreground">{user.displayName}</p>
                    <p className="truncate text-sm text-muted-foreground">
                        {(user.followers)} followers
                    </p>
                </div>
            </Link>
            <Button
                variant={isFollowing ? "outline" : "gold"}
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
            >
                {isFollowing ? "Following" : "Follow"}
            </Button>
        </div>
    );
};

export default SuggestedUsers;