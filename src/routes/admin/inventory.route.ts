import { Router, Request, Response } from "express";
import adminInventoryController from "../../controller/admin/inventory.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

router.get("/", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminInventoryController.list(req, res)
);

router.get("/provider/:providerId", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminInventoryController.getByProviderId(req, res)
);

router.get("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminInventoryController.getById(req, res)
);

router.delete("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminInventoryController.remove(req, res)
);

export default router;
