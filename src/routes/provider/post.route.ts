import { Router } from "express";
import postController from "../../controller/provider/post.controller";
import { authorizedMiddleware, providerMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

// Provider CRUD
router.post("/", authorizedMiddleware, providerMiddleware, (req, res) => postController.create(req, res));
router.get("/my", authorizedMiddleware, providerMiddleware, (req, res) => postController.getMyPosts(req, res));
router.put("/:id", authorizedMiddleware, providerMiddleware, (req, res) => postController.update(req, res));
router.delete("/:id", authorizedMiddleware, providerMiddleware, (req, res) => postController.remove(req, res));

// Public
router.get("/:id", (req, res) => postController.getById(req, res));

export default router;
