import { Router } from "express";
import { ProviderController } from "../../controller/provider.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";
import { uploads } from "../../middleware/upload.middleware";
import { Request, Response } from "express";

const router: Router = Router();
const providerController = new ProviderController();

// Create provider (admin only)
router.post(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    uploads.single("image"),
    (req: Request, res: Response) => providerController.createProvider(req, res)
);

// Get all providers (admin only)
router.get(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    (req: Request, res: Response) => providerController.getAllProviders(req, res)
);

// Get provider by ID (admin only)
router.get(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req: Request, res: Response) => providerController.getProvider(req, res)
);

// Update provider (admin only)
router.put(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    uploads.single("image"),
    (req: Request, res: Response) => providerController.updateProvider(req, res)
);

// Delete provider (admin only)
router.delete(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req: Request, res: Response) => providerController.deleteProvider(req, res)
);

export default router;
