import { Router } from "express";
import postController from "../../controller/provider/post.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

router.get("/", authorizedMiddleware, adminMiddleware, (req, res) => postController.listAll(req, res));
router.get("/:id", authorizedMiddleware, adminMiddleware, (req, res) => postController.getById(req, res));
router.delete("/:id", authorizedMiddleware, adminMiddleware, (req, res) => postController.adminDelete(req, res));

export default router;
