import { Router } from "express";
import { AdminUserController } from "../../controller/admin/user.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";
import { Request, Response } from "express";

const router: Router = Router();
const adminUserController = new AdminUserController();

router.post("/", authorizedMiddleware,adminUserController.createUser);

router.get("/test", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Admin access granted"
    });
});

export default router;