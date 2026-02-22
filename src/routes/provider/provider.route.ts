import { Router } from "express";
import { ProviderController } from "../../controller/provider/provider.controller";
import { authorizedMiddleware, providerMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router = Router();
const providerController = new ProviderController();

// Auth routes
router.post("/register", (req, res) => providerController.register(req, res));
router.post("/login", (req, res) => providerController.login(req, res));

// Provider self-service: set their type
router.put("/set-type", authorizedMiddleware, providerMiddleware, (req, res) => providerController.setProviderType(req, res));
router.post("/set-type", authorizedMiddleware, providerMiddleware, (req, res) => providerController.setProviderType(req, res));
router.get("/me", authorizedMiddleware, providerMiddleware, (req, res) => providerController.getMyProfile(req, res));
router.put("/profile", authorizedMiddleware, providerMiddleware, (req, res) => providerController.updateMyProfile(req, res));

// Admin: approve/reject providers
router.put("/approve/:id", authorizedMiddleware, adminMiddleware, (req, res) => providerController.approveProvider(req, res));
router.put("/reject/:id", authorizedMiddleware, adminMiddleware, (req, res) => providerController.rejectProvider(req, res));
router.get("/status/:status", authorizedMiddleware, adminMiddleware, (req, res) => providerController.getProvidersByStatus(req, res));

// CRUD routes
router.get("/verified-locations", (req, res) => providerController.getVerifiedLocations(req, res));
router.get("/", (req, res) => providerController.getAllProviders(req, res));
router.get("/:id", (req, res) => providerController.getProvider(req, res));
router.put("/:id", (req, res) => providerController.updateProvider(req, res));
router.delete("/:id", (req, res) => providerController.deleteProvider(req, res));

export default router;
