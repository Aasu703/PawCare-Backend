import { Router } from "express";
import postController from "../../controller/provider/post.controller";

const router = Router();

// Public feed of provider posts
router.get("/", (req, res) => postController.getPublicPosts(req, res));
router.get("/provider/:providerId", (req, res) => postController.getByProvider(req, res));
router.get("/:id", (req, res) => postController.getById(req, res));

export default router;
