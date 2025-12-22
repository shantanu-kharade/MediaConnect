import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { useUpdateProfile } from "../hooks/useUsers";

const EditProfileModal = ({ user = {}, isOpen = false, onClose = () => {} }) => {
    const userProfile = user.profile || {};
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        bio: userProfile.bio || "",
        avatar: userProfile.avatar || "",
    });

    // Handle hydration mismatch (ensure portal only runs on client)
    useEffect(() => {
        setMounted(true);
        // Prevent background scrolling when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!isOpen || !mounted) return null;

    // Use createPortal to render this element at the end of the document body
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Modal Content */}
            <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-card p-6 shadow-2xl border border-border animate-in zoom-in-95 duration-200">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="font-display text-2xl font-bold text-foreground">
                    Edit Profile
                </h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-foreground">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            placeholder="Enter first name"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-foreground">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            placeholder="Enter last name"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-foreground">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            placeholder="Write your bio"
                        />
                    </div>

                    {/* Avatar URL */}
                    <div>
                        <label className="block text-sm font-medium text-foreground">
                            Avatar URL
                        </label>
                        <input
                            type="url"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>

                    {/* Avatar Preview */}
                    {formData.avatar && (
                        <div className="mt-4 flex justify-center">
                            <div className="relative">
                                <img
                                    src={formData.avatar}
                                    alt="Avatar Preview"
                                    className="h-24 w-24 rounded-full object-cover ring-4 ring-border"
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="gold"
                            disabled={isPending}
                            className="flex-1 bg-gold text-black hover:bg-gold/90"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default EditProfileModal;