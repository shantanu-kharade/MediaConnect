import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { cn } from "../lib/utils";

const PostCard = ({ post, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <article
      className={cn(
        "animate-fade-up rounded-xl border border-border bg-card p-5 shadow-elegant transition-all duration-300 hover:shadow-elegant-lg",
        `stagger-${(index % 5) + 1}`
      )}
      style={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <Link
          to={`/profile}`}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <img
            src={post.authorAvatar || "https://via.placeholder.com/150"}
            alt={post.authorname || "Author Avatar"}
            className="h-11 w-11 rounded-full border-2 border-gold/30 object-cover"
          />
          <div>
            <h3 className="font-display font-semibold text-foreground">
              {post.text || "post title"}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{post.username || "username"} · {post.timestamp}
            </p>
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="mt-4">
        <p className="font-body leading-relaxed text-foreground">{post.content}</p>
        {post.image && (
          <div className="mt-4 overflow-hidden rounded-lg">
            <img
              src={post.image}
              alt="Post content"
              className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
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
            className={cn(
              "gap-2 transition-colors",
              isLiked && "text-destructive hover:text-destructive"
            )}
          >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
            <span className="text-sm">{(likes)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{post}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-5 w-5" />
            <span className="text-sm">{(post)}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={cn(isBookmarked && "text-gold")}
        >
          <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
        </Button>
      </div>
    </article>
  );
};

export default PostCard;