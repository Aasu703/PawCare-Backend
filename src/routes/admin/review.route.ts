import { Router, Request, Response } from "express";
import adminReviewController from "../../controller/admin/review.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

router.get("/", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminReviewController.list(req, res)
);

router.get("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminReviewController.getById(req, res)
);

router.delete("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminReviewController.remove(req, res)
);

export default router;
