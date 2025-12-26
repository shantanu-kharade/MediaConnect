import express from "express";
import {
  updateProfile,
  changePassword,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
  getUserById,
  getAllUsers,
  getSuggestedUsers,
  searchUser
} from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile/update", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/follow/:targetUserId", authMiddleware, followUser);
router.post("/unfollow/:targetUserId", authMiddleware, unfollowUser);
router.get("/followers/:userId", getFollowers);
router.get("/followings/:userId", getFollowings);
router.get("/suggested", authMiddleware, getSuggestedUsers);
router.get("/search-users", searchUser)
router.get("/:userId", getUserById);
router.get("/", getAllUsers);

export default router;
