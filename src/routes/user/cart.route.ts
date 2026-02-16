import { Router } from "express";
import CartController from "../../controller/user/cart.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

// Get current user's cart
router.get("/", authorizedMiddleware, (req, res, next) => CartController.getCart(req, res, next));
router.get("/my", authorizedMiddleware, (req, res, next) => CartController.getCart(req, res, next));
// Add item to cart
router.post("/add", authorizedMiddleware, (req, res, next) => CartController.addItem(req, res, next));
// Update cart item
router.put("/item/:itemId", authorizedMiddleware, (req, res, next) => CartController.updateItem(req, res, next));
// Remove cart item
router.delete("/item/:itemId", authorizedMiddleware, (req, res, next) => CartController.removeItem(req, res, next));
// Update/replace cart
router.put("/", authorizedMiddleware, (req, res, next) => CartController.updateCart(req, res, next));
// Clear cart
router.delete("/", authorizedMiddleware, (req, res, next) => CartController.clearCart(req, res, next));

export default router;
