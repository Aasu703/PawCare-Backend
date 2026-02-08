import { Router } from "express";
import { ProviderServiceController } from "../../controller/provider/service.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const controller = new ProviderServiceController();
const router = Router();

router.use(authorizedMiddleware);

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
