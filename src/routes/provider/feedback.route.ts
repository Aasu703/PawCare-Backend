import { Router, Request, Response } from "express";
import feedbackController from "../../controller/provider/feedback.controller";
import { authorizedMiddleware, providerMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

// Create feedback for a provider
router.post("/", authorizedMiddleware, providerMiddleware, (req: Request, res: Response) =>
    feedbackController.create(req, res)
);

// Get feedback by provider ID
router.get("/provider/:providerId", authorizedMiddleware, providerMiddleware, (req: Request, res: Response) =>
    feedbackController.getByProviderId(req, res)
);

// Get feedback by ID
router.get("/:id", authorizedMiddleware, providerMiddleware, (req: Request, res: Response) =>
    feedbackController.getById(req, res)
);

// Update feedback
router.put("/:id", authorizedMiddleware, providerMiddleware, (req: Request, res: Response) =>
    feedbackController.update(req, res)
);

// Delete feedback
router.delete("/:id", authorizedMiddleware, providerMiddleware, (req: Request, res: Response) =>
    feedbackController.remove(req, res)
);

export default router;
