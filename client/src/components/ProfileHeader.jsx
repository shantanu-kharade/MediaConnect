import { useState } from "react";
import { Settings, Edit2, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { Button } from "../components/ui/button.jsx";



const ProfileHeader = ({ user, isOwnProfile = false }) => {
    const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);

    return (
        <div className="animate-fade-up">
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden rounded-b-2xl bg-gradient-to-br from-gold/20 via-gold/10 to-secondary sm:h-64">
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="relative mx-auto max-w-4xl px-4">
                <div className="relative -mt-16 flex flex-col items-center sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt={user.displayName || "User Avatar"}
                            className="h-32 w-32 rounded-full border-4 border-card object-cover shadow-elegant sm:h-40 sm:w-40"
                        />
                        {isOwnProfile && (
                            <Button
                                variant="elegant"
                                size="icon"
                                className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Info */}
                    <div className="mt-4 flex flex-1 flex-col items-center text-center sm:items-start sm:pb-2 sm:text-left">
                        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                            {user.displayName || "display name"}
                        </h1>
                        <p className="text-muted-foreground">@{user.username || "username"}</p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-3 sm:mt-0 sm:pb-2">
                        {isOwnProfile ? (
                            <>
                                <Button variant="outline">
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Settings className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant={isFollowing ? "outline" : "gold"}
                                    onClick={() => setIsFollowing(!isFollowing)}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </Button>
                                <Button variant="outline">Message</Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Bio */}
                <div className="mt-6 max-w-2xl">
                    <p className="font-body text-foreground">{user.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Pune, MH, India
                        </span>
                        <span className="flex items-center gap-1">
                            <LinkIcon className="h-4 w-4" />
                            <a href="#" className="text-gold hover:underline">
                                portfolio.com
                            </a>
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined December 2025
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 flex justify-center gap-8 border-b border-border pb-6 sm:justify-start">
                    <div className="text-center sm:text-left">
                        <p className="font-display text-xl font-bold text-foreground">
                            20
                        </p>
                        <p className="text-sm text-muted-foreground">Posts</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="font-display text-xl font-bold text-foreground">
                            4.5k
                        </p>
                        <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="font-display text-xl font-bold text-foreground">
                            1.2k
                        </p>
                        <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;