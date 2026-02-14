import { Router } from "express";
import OrderController from "../../controller/user/order.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

// User creates an order
router.post("/", authorizedMiddleware, (req, res, next) => OrderController.create(req, res, next));
// User's own orders
router.get("/my", authorizedMiddleware, (req, res, next) => {
    req.params.userId = (req as any).user?.id || (req as any).user?._id?.toString();
    OrderController.getByUser(req, res, next);
});
// Get order by ID
router.get("/:id", authorizedMiddleware, (req, res, next) => OrderController.getById(req, res, next));
// Update order
router.put("/:id", authorizedMiddleware, (req, res, next) => OrderController.update(req, res, next));
// Delete order
router.delete("/:id", authorizedMiddleware, (req, res, next) => OrderController.remove(req, res, next));

export default router;
