import User from "../model/userModel.js";
import bcrypt from "bcryptjs";

export const searchUser = async (req, res) =>{
    const userId = req.user.id
    
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, bio, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "profile.firstName": firstName,
                    "profile.lastName": lastName,
                    "profile.bio": bio,
                    "profile.avatar": avatar,
                },
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Old password and new password are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid old password" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const followUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.params;

        if (userId === targetUserId) {
            return res.status(400).json({ message: "Cannot follow yourself" });
        }

        // Add targetUser to user's followings
        await User.findByIdAndUpdate(userId, {
            $addToSet: { followings: targetUserId },
        });

        // Add user to targetUser's followers
        await User.findByIdAndUpdate(targetUserId, {
            $addToSet: { followers: userId },
            $inc: { followerCount: 1 },
        });

        // Increment user's followingCount
        await User.findByIdAndUpdate(userId, {
            $inc: { followingCount: 1 },
        });

        res.status(200).json({
            message: "User followed successfully",
        });
    } catch (error) {
        console.error("Follow user error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.params;

        if (userId === targetUserId) {
            return res.status(400).json({ message: "Cannot unfollow yourself" });
        }

        // Remove targetUser from user's followings
        await User.findByIdAndUpdate(userId, {
            $pull: { followings: targetUserId },
            $inc: { followingCount: -1 },
        });

        // Remove user from targetUser's followers
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: userId },
            $inc: { followerCount: -1 },
        });

        res.status(200).json({
            message: "User unfollowed successfully",
        });
    } catch (error) {
        console.error("Unfollow user error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate(
            "followers",
            "username profile avatar followerCount followingCount"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Followers retrieved successfully",
            followers: user.followers,
        });
    } catch (error) {
        console.error("Get followers error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getFollowings = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate(
            "followings",
            "username profile avatar followerCount followingCount"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Followings retrieved successfully",
            followings: user.followings,
        });
    } catch (error) {
        console.error("Get followings error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate("posts")
            .populate("followers", "username profile avatar")
            .populate("followings", "username profile avatar");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile,
                posts: user.posts,
                followers: user.followers,
                followings: user.followings,
                followerCount: user.followerCount,
                followingCount: user.followingCount,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Get user by id error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select(
            "username profile followerCount followingCount"
        );

        res.status(200).json({
            message: "Users retrieved successfully",
            users,
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 3;

        // Get current user's followings
        const currentUser = await User.findById(userId).select("followings");

        // Find all users except the current user
        const suggestedUsers = await User.find({ _id: { $ne: userId } })
            .select("username profile followerCount followingCount")
            .limit(limit * 2); // Get extra to randomize

        // Randomize and limit results
        const randomized = suggestedUsers.sort(() => Math.random() - 0.5).slice(0, limit);

        // Add isFollowing flag to each user
        const usersWithFollowingStatus = randomized.map(user => ({
            ...user.toObject(),
            isFollowing: currentUser.followings.includes(user._id),
        }));

        res.status(200).json({
            message: "Suggested users retrieved successfully",
            users: usersWithFollowingStatus,
        });
    } catch (error) {
        console.error("Get suggested users error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
