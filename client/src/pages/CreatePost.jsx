import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Image, X, Smile, MapPin, Users } from "lucide-react";
import Layout from "../components/layout/Layout.jsx";
import { Button } from "../components/ui/button.jsx";
import { toast } from "../hooks/use-toast.js";
import { cn } from "../lib/utils.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCreatePost } from "../hooks/usePosts.js";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const userProfile = user?.profile || {};
  const navigate = useNavigate();
  const { mutate: createPost, isPending } = useCreatePost();

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage) {
      toast({
        title: "Error",
        description: "Please add some content or an image.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please add an image to create a post.",
        variant: "destructive",
      });
      return;
    }

    // Create post with media (File object) and caption
    console.log("Creating post with file:", imageFile, "Caption:", content);
    createPost(
      {
        media: imageFile,
        caption: content,
      },
      {
        onSuccess: () => {
          // Clear form
          setContent("");
          setSelectedImage(null);
          setImageFile(null);
          // Navigate back to feed
          navigate("/feed");
        },
      }
    );
  };

  const characterLimit = 500;
  const remainingCharacters = characterLimit - content.length;

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-fade-up rounded-xl border border-border bg-card p-6 shadow-elegant">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Create Post
            </h1>
            <Button
              variant="gold"
              onClick={handleSubmit}
              disabled={isPending || (!content.trim() && !selectedImage)}
            >
              {isPending ? "Publishing..." : "Publish"}
            </Button>
          </div>

          {/* User Info */}
          <div className="mb-6 flex items-center gap-3">
            <img
              src={userProfile.avatar || "https://via.placeholder.com/48"}
              alt="Your avatar"
              className="h-12 w-12 rounded-full border-2 border-gold/30 object-cover"
            />
            <div>
              <h3 className="font-medium text-foreground">
                {userProfile.firstName || "Name"} {userProfile.lastName || ""}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Public</span>
              </div>
            </div>
          </div>

          {/* Content Input */}
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, characterLimit))}
              placeholder="What's on your mind?"
              className="min-h-[150px] w-full resize-none bg-transparent font-body text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex justify-end">
              <span
                className={cn(
                  "text-sm",
                  remainingCharacters < 50
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {remainingCharacters}
              </span>
            </div>
          </div>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <img
                src={selectedImage}
                alt="Selected"
                className="h-auto max-h-96 w-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 rounded-full bg-foreground/80 p-2 text-background transition-colors hover:bg-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 border-t border-border pt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 text-muted-foreground hover:text-foreground"
              disabled={isPending}
            >
              <Image className="h-5 w-5 text-green-500" />
              Photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              disabled={isPending}
            >
              <Smile className="h-5 w-5 text-yellow-500" />
              Feeling
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              disabled={isPending}
            >
              <MapPin className="h-5 w-5 text-red-500" />
              Location
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 animate-fade-up rounded-lg bg-secondary p-4 stagger-2">
          <h3 className="font-medium text-foreground">Tips for a great post:</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>• Share authentic moments and stories</li>
            <li>• Add high-quality images to increase engagement</li>
            <li>• Use relevant hashtags to reach more people</li>
            <li>• Engage with your audience in the comments</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;