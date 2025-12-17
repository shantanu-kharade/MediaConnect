import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;


        if (!username || !email || !password) {
            return res
                .status(400)
                .json({ message: "Username, email, and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profile: {
                firstName: firstName || "",
                lastName: lastName || "",
            },
        });

        await newUser.save();

        // Generate token
        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profile: newUser.profile,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const logout = (req, res) => {
    try {
        // Client-side token deletion is typically handled on the frontend
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
            .populate("posts")
            .populate("followers", "username profile avatar")
            .populate("followings", "username profile avatar");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
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
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
