import Post from "../model/postsModel.js";
import User from "../model/userModel.js";

export const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { media, caption } = req.body;

        if (!media) {
            return res.status(400).json({ message: "Media is required" });
        }

        const newPost = new Post({
            media,
            caption: caption || "",
        });

        await newPost.save();

        // Add post to user's posts array
        await User.findByIdAndUpdate(userId, {
            $push: { posts: newPost._id },
        });

        res.status(201).json({
            message: "Post created successfully",
            post: newPost,
        });
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({ isDeleted: false })
            .populate("comments")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Posts retrieved successfully",
            posts,
        });
    } catch (error) {
        console.error("Get all posts error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate("comments");

        if (!post || post.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({
            message: "Post retrieved successfully",
            post,
        });
    } catch (error) {
        console.error("Get post by id error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { caption } = req.body;

        const post = await Post.findByIdAndUpdate(
            postId,
            { caption },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({
            message: "Post updated successfully",
            post,
        });
    } catch (error) {
        console.error("Update post error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findByIdAndUpdate(
            postId,
            { isDeleted: true },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Remove post from user's posts array
        await User.findByIdAndUpdate(userId, {
            $pull: { posts: postId },
        });

        res.status(200).json({
            message: "Post deleted successfully",
            post,
        });
    } catch (error) {
        console.error("Delete post error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likeCount: 1 } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({
            message: "Post liked successfully",
            post,
        });
    } catch (error) {
        console.error("Like post error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likeCount: -1 } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({
            message: "Post unliked successfully",
            post,
        });
    } catch (error) {
        console.error("Unlike post error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
