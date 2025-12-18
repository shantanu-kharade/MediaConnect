import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { useUpdateProfile } from "../hooks/useUsers";

const EditProfileModal = ({ user = {}, isOpen = false, onClose = () => {} }) => {
    const userProfile = user.profile || {};
    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const [formData, setFormData] = useState({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        bio: userProfile.bio || "",
        avatar: userProfile.avatar || "",
    });

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-card p-6 shadow-lg">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-6 w-6" />
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
                            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-gold focus:outline-none"
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
                            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-gold focus:outline-none"
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
                            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-gold focus:outline-none"
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
                            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-gold focus:outline-none"
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>

                    {/* Avatar Preview */}
                    {formData.avatar && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-medium text-foreground">Preview:</p>
                            <img
                                src={formData.avatar}
                                alt="Avatar Preview"
                                className="h-24 w-24 rounded-full object-cover"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3">
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
                            className="flex-1"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
