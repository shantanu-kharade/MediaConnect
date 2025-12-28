import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, X } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { cn } from "../lib/utils.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLikePost, useAddComment, useDeleteComment } from "../hooks/usePosts.js";

const PostCard = ({ post, index = 0 }) => {
    const { user: currentUser } = useAuth();
    const currentUserId = currentUser?.id;
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const { mutate: likePost } = useLikePost();
    const { mutate: addComment } = useAddComment();
    const { mutate: deleteComment } = useDeleteComment();

    // Extract user data from populated userId
    const author = post.userId || post.user || {};
    const userId = typeof author === 'object' ? author._id : author;
    const username = typeof author === 'object' ? author.username : 'Unknown';
    const userProfile = typeof author === 'object' ? author.profile : {};
    const authorAvatar = userProfile?.avatar || userProfile?.profilePicture || "https://via.placeholder.com/150";

    // Check if current user liked this post
    const isLiked = post.likes?.some(like =>
        (typeof like === 'object' ? like._id : like) === currentUserId
    ) || false;

    const handleLike = () => {
        likePost({ postId: post._id, isLiked });
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        addComment(
            { postId: post._id, content: commentText },
            {
                onSuccess: () => {
                    setCommentText("");
                },
            }
        );
    };

    const handleDeleteComment = (commentId) => {
        deleteComment(commentId);
    };

    // Format date
    const formatDate = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "now";
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return postDate.toLocaleDateString();
    };

    return (
        <article
            className={cn(
                "animate-fade-up rounded-xl border border-border bg-card p-5 shadow-elegant transition-all duration-300 hover:shadow-elegant-lg",
                `stagger-${(index % 5) + 1}`
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <Link
                    to={`/profile/${userId}`}
                    className="flex items-center gap-3 transition-opacity hover:opacity-80"
                >
                    <img
                        src={authorAvatar}
                        alt={username}
                        className="h-11 w-11 rounded-full border-2 border-gold/30 object-cover"
                    />
                    <div>
                        <h3 className="font-display font-semibold text-foreground">
                            {username}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            @{username} · {formatDate(post.createdAt)}
                        </p>
                    </div>
                </Link>
                {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button> */}
            </div>

            {/* Caption */}
            <div className="mt-4">
                {post.caption && (
                    <p className="font-body leading-relaxed text-foreground">{post.caption}</p>
                )}

                {/* Media */}
                {post.media && (
                    <div className="mt-4 overflow-hidden rounded-lg bg-muted">
                        <img
                            src={post.media}
                            alt="Post media"
                            className="h-auto w-full max-h-96 object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        disabled={!currentUserId}
                        className={cn(
                            "gap-2 transition-colors",
                            isLiked && "text-destructive hover:text-destructive"
                        )}
                    >
                        <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                        <span className="text-sm">{post.likeCount || 0}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm">{post.comments?.length || 0}</span>
                    </Button>
                    {/* <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-5 w-5" />
                        <span className="text-sm">0</span>
                    </Button> */}
                </div>
                {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={cn(isBookmarked && "text-gold")}
                >
                    <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
                </Button> */}
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 border-t border-border pt-4">
                    {/* Add Comment */}
                    {currentUserId && (
                        <div className="mb-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                            <Button
                                size="sm"
                                variant="gold"
                                onClick={handleAddComment}
                                disabled={!commentText.trim()}
                            >
                                Post
                            </Button>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-3">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => {
                                const commentAuthor = comment.userId || {};
                                const commentUserId = typeof commentAuthor === 'object' ? commentAuthor._id : commentAuthor;
                                const commentUsername = typeof commentAuthor === 'object' ? commentAuthor.username : 'Unknown';
                                const commentAvatar = typeof commentAuthor === 'object' ? commentAuthor.profile?.avatar : '';
                                const isCommentAuthor = currentUserId === commentUserId;

                                return (
                                    <div key={comment._id} className="flex gap-2">
                                        <Link to={`/profile/${commentUserId}`}>
                                            <img
                                                src={commentAvatar || "https://via.placeholder.com/32"}
                                                alt={commentUsername}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        </Link>
                                        <div className="flex-1">
                                            <div className="rounded-lg bg-muted p-2">
                                                <Link
                                                    to={`/profile/${commentUserId}`}
                                                    className="text-sm font-semibold text-foreground hover:text-gold"
                                                >
                                                    {commentUsername}
                                                </Link>
                                                <p className="text-sm text-foreground">{comment.content}</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDate(comment.createdAt)}
                                            </p>
                                        </div>
                                        {isCommentAuthor && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className="h-6 w-6 p-0"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground">No comments yet</p>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
};

export default PostCard;