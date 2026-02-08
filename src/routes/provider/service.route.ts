import { Router, Request, Response } from "express";
import providerServiceController from "../../controller/provider/service.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";
import { validateBody } from "../../middleware/validate.middleware";
import { CreateServiceDto, UpdateServiceDto } from "../../dtos/service.dto";

const router: Router = Router();

// Providers don't supply `providerId` in the body; server injects it from their profile
router.post(
  "/",
  authorizedMiddleware,
  validateBody((CreateServiceDto as any).omit({ providerId: true })),
  (req: Request, res: Response) => providerServiceController.create(req, res)
);

router.put(
  "/:id",
  authorizedMiddleware,
  validateBody((UpdateServiceDto as any).omit({ providerId: true })),
  (req: Request, res: Response) => providerServiceController.update(req, res)
);

router.delete("/:id", authorizedMiddleware, (req: Request, res: Response) =>
  providerServiceController.remove(req, res)
);

export default router;
