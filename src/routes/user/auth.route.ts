import { Router } from "express";
import { AuthController } from "../../controller/user/auth.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";
import { uploads } from "../../middleware/upload.middleware";
import { asyncHandler } from "../../middleware/async-handler.middleware";

const router = Router();
const authController = new AuthController();



router.post("/register", asyncHandler((req, res) => authController.register(req, res)));
router.post("/login", asyncHandler((req, res) => authController.login(req, res)));
router.post("/logout", asyncHandler((req, res) => authController.logout(req, res)));

router.get('/whoami', authorizedMiddleware, asyncHandler((req, res) => authController.getUserProfile(req, res)));

router.put(
    '/update-profile',
    authorizedMiddleware,
    uploads.single('image'), // expecting a single file with field name 'image' key in form-data
    asyncHandler((req, res) => authController.updateUser(req, res))
)

router.post("/request-password-reset", asyncHandler((req, res) => authController.sendResetPasswordEmail(req, res)));
router.post("/reset-password/:token", asyncHandler((req, res) => authController.resetPassword(req, res)));

export default router;