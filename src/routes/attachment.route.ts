import { Router, Request, Response } from "express";
import attachmentController from "../controller/pet/attachment.controller";
import { authorizedMiddleware } from "../middleware/authorization.middleware";

const router: Router = Router();

// Create an attachment
router.post("/", authorizedMiddleware, (req: Request, res: Response) =>
    attachmentController.create(req, res)
);

// Get attachments by health record ID
router.get("/health-record/:healthRecordId", authorizedMiddleware, (req: Request, res: Response) =>
    attachmentController.getByHealthRecordId(req, res)
);

// Get attachment by ID
router.get("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    attachmentController.getById(req, res)
);

// Update attachment
router.put("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    attachmentController.update(req, res)
);

// Delete attachment
router.delete("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    attachmentController.remove(req, res)
);

export default router;
