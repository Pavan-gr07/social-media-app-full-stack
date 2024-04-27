import express from "express";
import { getPosts, addPosts, deletePost } from "../controllers/posts.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPosts);
router.delete("/", deletePost);

export default router;
