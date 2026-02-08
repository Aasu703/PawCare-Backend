import { Router, Request, Response } from "express";
import inventoryController from "../../controller/provider/inventory.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

// Create inventory item
router.post("/", authorizedMiddleware, (req: Request, res: Response) =>
    inventoryController.create(req, res)
);

// Get inventory by provider ID
router.get("/provider/:providerId", authorizedMiddleware, (req: Request, res: Response) =>
    inventoryController.getByProviderId(req, res)
);

// Get inventory item by ID
router.get("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    inventoryController.getById(req, res)
);

// Update inventory item
router.put("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    inventoryController.update(req, res)
);

// Delete inventory item
router.delete("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    inventoryController.remove(req, res)
);

export default router;
