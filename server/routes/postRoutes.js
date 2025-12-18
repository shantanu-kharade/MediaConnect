import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from "../controller/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadMiddleware, getMediaUrl } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, uploadMiddleware, getMediaUrl, createPost);
router.get("/all", getAllPosts);
router.get("/:postId", getPostById);
router.put("/update/:postId", authMiddleware, updatePost);
router.delete("/delete/:postId", authMiddleware, deletePost);
router.post("/like/:postId", authMiddleware, likePost);
router.post("/unlike/:postId", authMiddleware, unlikePost);

export default router;
