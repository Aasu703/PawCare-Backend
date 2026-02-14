import { Router } from "express";
import OrderController from "../../controller/user/order.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

router.get("/", authorizedMiddleware, adminMiddleware, (req, res, next) => OrderController.list(req, res, next));
router.get("/:id", authorizedMiddleware, adminMiddleware, (req, res, next) => OrderController.getById(req, res, next));
router.put("/:id", authorizedMiddleware, adminMiddleware, (req, res, next) => OrderController.update(req, res, next));
router.delete("/:id", authorizedMiddleware, adminMiddleware, (req, res, next) => OrderController.remove(req, res, next));

export default router;
