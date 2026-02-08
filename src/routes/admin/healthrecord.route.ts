import { Router, Request, Response } from "express";
import adminHealthRecordController from "../../controller/admin/healthrecord.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

router.get("/", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminHealthRecordController.list(req, res)
);

router.get("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminHealthRecordController.getById(req, res)
);

router.delete("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
    adminHealthRecordController.remove(req, res)
);

export default router;
