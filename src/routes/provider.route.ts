import { Router } from "express";
import { ProviderController } from "../controller/provider/provider.controller";

const router = Router();
const providerController = new ProviderController();

// Auth routes
router.post("/register", (req, res) => providerController.register(req, res));
router.post("/login", (req, res) => providerController.login(req, res));

// CRUD routes
router.get("/", (req, res) => providerController.getAllProviders(req, res));
router.get("/:id", (req, res) => providerController.getProvider(req, res));
router.put("/:id", (req, res) => providerController.updateProvider(req, res));
router.delete("/:id", (req, res) => providerController.deleteProvider(req, res));

export default router;
