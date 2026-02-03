import { Router } from "express";
import { AdminUserController } from "../../controller/admin/user.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";
import { Request, Response } from "express";

const router: Router = Router();
const adminUserController = new AdminUserController();

router.post("/", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) => adminUserController.createUser(req, res));
router.get("/", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) => adminUserController.getAllUsers(req, res));
router.get("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) => adminUserController.getUserById(req, res));
router.put("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) => adminUserController.updateUser(req, res));
router.delete("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) => adminUserController.deleteUser(req, res));



export default router;