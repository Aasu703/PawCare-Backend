import { Router, Request, Response } from "express";
import inventoryController from "../../controller/provider/inventory.controller";
import { authorizedMiddleware, providerMiddleware } from "../../middleware/authorization.middleware";
import { requireProviderType } from "../../middleware/service-authorization.middleware";

const router: Router = Router();

// Public: list all inventory items (used by shop)
router.get("/", (req: Request, res: Response) =>
    inventoryController.listPublic(req, res)
);

// Create inventory item
router.post("/", authorizedMiddleware, providerMiddleware, requireProviderType("shop"), (req: Request, res: Response) =>
    inventoryController.create(req, res)
);

// Get inventory by provider ID
router.get("/provider/:providerId", authorizedMiddleware, providerMiddleware, (req: Request, res: Response) =>
    inventoryController.getByProviderId(req, res)
);

// Get inventory item by ID
router.get("/:id", authorizedMiddleware, providerMiddleware, (req: Request, res: Response) =>
    inventoryController.getById(req, res)
);

// Update inventory item
router.put("/:id", authorizedMiddleware, providerMiddleware, requireProviderType("shop"), (req: Request, res: Response) =>
    inventoryController.update(req, res)
);

// Delete inventory item
router.delete("/:id", authorizedMiddleware, providerMiddleware, requireProviderType("shop"), (req: Request, res: Response) =>
    inventoryController.remove(req, res)
);

export default router;
