import { Router, Request, Response } from "express";
import messageController from "../../controller/user/message.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

// Create a message
router.post("/", authorizedMiddleware, (req: Request, res: Response) =>
    messageController.create(req, res)
);

// Get my messages
router.get("/my", authorizedMiddleware, (req: Request, res: Response) =>
    messageController.getMyMessages(req, res)
);

// Get message by ID
router.get("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    messageController.getById(req, res)
);

// Update message
router.put("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    messageController.update(req, res)
);

// Delete message
router.delete("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    messageController.remove(req, res)
);

export default router;
