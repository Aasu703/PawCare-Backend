import { Router } from "express";
import PublicInventoryController from "../../controller/public/inventory.controller";

const router = Router();

// Public: list all products
router.get("/", PublicInventoryController.list);

// Public: list products by provider
router.get("/provider/:providerId", PublicInventoryController.listByProvider);

// Public: get product by id
router.get("/:id", PublicInventoryController.getById);

export default router;
