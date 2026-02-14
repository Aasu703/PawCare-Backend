import { Router } from "express";
import ServiceController from "../../controller/public/service.controller";

const router = Router();

// Public: list services
router.get("/", ServiceController.list);

// Public: get service by id
router.get("/:id", ServiceController.getById);

// Public: list services by provider
router.get("/provider/:providerId", ServiceController.listByProvider);

export default router;
