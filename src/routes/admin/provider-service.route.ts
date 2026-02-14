import { Router } from "express";
import adminProviderServiceController from "../../controller/admin/provider-service.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

router.get("/", authorizedMiddleware, adminMiddleware, (req, res) =>
    adminProviderServiceController.list(req, res)
);

router.get("/:id", authorizedMiddleware, adminMiddleware, (req, res) =>
    adminProviderServiceController.getById(req, res)
);

router.put("/:id/approve", authorizedMiddleware, adminMiddleware, (req, res) =>
    adminProviderServiceController.approve(req, res)
);

router.put("/:id/reject", authorizedMiddleware, adminMiddleware, (req, res) =>
    adminProviderServiceController.reject(req, res)
);

router.put("/:id/suspend", authorizedMiddleware, adminMiddleware, (req, res) =>
    adminProviderServiceController.suspend(req, res)
);

export default router;
