import express from "express";
import {
  addComment,
  getPostComments,
  deleteComment,
  updateComment,
} from "../controller/commentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:postId/add", authMiddleware, addComment);
router.get("/:postId", getPostComments);
router.delete("/:commentId", authMiddleware, deleteComment);
router.put("/:commentId", authMiddleware, updateComment);

export default router;
