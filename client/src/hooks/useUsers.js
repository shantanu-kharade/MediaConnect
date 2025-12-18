import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/api.js"  ;
import { toast } from "./use-toast.js";
import { useAuth } from "../context/AuthContext.jsx";

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const data = await usersApi.getAllUsers();
            return data.users || data;
        },
    });
};

export const useUser = (userId) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
            const data = await usersApi.getUserById(userId);
            return data.user || data;
        },
        enabled: !!userId,
    });
};

export const useFollowers = (userId) => {
    return useQuery({
        queryKey: ["followers", userId],
        queryFn: async () => {
            const data = await usersApi.getFollowers(userId);
            return data.followers || data;
        },
        enabled: !!userId,
    });
};

export const useFollowings = (userId) => {
    return useQuery({
        queryKey: ["followings", userId],
        queryFn: async () => {
            const data = await usersApi.getFollowings(userId);
            return data.followings || data;
        },
        enabled: !!userId,
    });
};

export const useFollowUser = () => {
    const queryClient = useQueryClient();
    const { refreshUser } = useAuth();

    return useMutation({
        mutationFn: async ({ userId, isFollowing }) => {
            if (isFollowing) {
                return usersApi.unfollowUser(userId);
            }
            return usersApi.followUser(userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["followers"] });
            queryClient.invalidateQueries({ queryKey: ["followings"] });
            refreshUser();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update follow status",
                variant: "destructive",
            });
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { refreshUser } = useAuth();

    return useMutation({
        mutationFn: async (profileData) => {
            return usersApi.updateProfile(profileData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            refreshUser();
            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile",
                variant: "destructive",
            });
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async ({ currentPassword, newPassword }) => {
            return usersApi.changePassword(currentPassword, newPassword);
        },
        onSuccess: () => {
            toast({
                title: "Password changed",
                description: "Your password has been updated successfully.",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to change password",
                variant: "destructive",
            });
        },
    });
};

export const useSuggestedUsers = (limit = 3) => {
    return useQuery({
        queryKey: ["suggestedUsers", limit],
        queryFn: async () => {
            const data = await usersApi.getSuggestedUsers(limit);
            return data.users || data;
        },
    });
};