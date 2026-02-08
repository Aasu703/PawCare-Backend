import { Router, Request, Response } from "express";
import reviewController from "../../controller/user/review.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

// Create a review
router.post("/", authorizedMiddleware, (req: Request, res: Response) =>
    reviewController.create(req, res)
);

// Get my reviews
router.get("/my", authorizedMiddleware, (req: Request, res: Response) =>
    reviewController.getMyReviews(req, res)
);

// Get review by ID
router.get("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    reviewController.getById(req, res)
);

// Update review
router.put("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    reviewController.update(req, res)
);

// Delete review
router.delete("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    reviewController.remove(req, res)
);

export default router;
