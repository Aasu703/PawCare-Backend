import { Router } from "express";
import { AdminStatsController } from "../../controller/admin/stats.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";
import { Request, Response } from "express";

const router: Router = Router();
const adminStatsController = new AdminStatsController();

router.get("/dashboard", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
  adminStatsController.getDashboardStats(req, res)
);

export default router;