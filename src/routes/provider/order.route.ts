import { Router } from "express";
import ProviderOrderController from "../../controller/provider/order.controller";
import { authorizedMiddleware, providerMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

// Provider: list orders containing their products
router.get("/my", authorizedMiddleware, providerMiddleware, (req, res) =>
    ProviderOrderController.listMyOrders(req, res)
);

// Provider: get single order detail
router.get("/:id", authorizedMiddleware, providerMiddleware, (req, res) =>
    ProviderOrderController.getById(req, res)
);

// Provider: update order status
router.put("/:id/status", authorizedMiddleware, providerMiddleware, (req, res) =>
    ProviderOrderController.updateStatus(req, res)
);

export default router;
