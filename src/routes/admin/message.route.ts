import { Router, Request, Response } from "express";
import adminMessageController from "../../controller/admin/message.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

router.get("/", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminMessageController.list(req, res)
);

router.get("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminMessageController.getById(req, res)
);

router.delete("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminMessageController.remove(req, res)
);

export default router;
