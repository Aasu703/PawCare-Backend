import { Router, Request, Response } from "express";
import adminFeedbackController from "../../controller/admin/feedback.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

router.get("/", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminFeedbackController.list(req, res)
);

router.get("/provider/:providerId", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminFeedbackController.getByProviderId(req, res)
);

router.get("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminFeedbackController.getById(req, res)
);

router.delete("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminFeedbackController.remove(req, res)
);

export default router;
