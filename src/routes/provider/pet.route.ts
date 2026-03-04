import { Router } from "express";
import { authorizedMiddleware, providerMiddleware } from "../../middleware/authorization.middleware";
import { ProviderPetController } from "../../controller/provider/pet.controller";

const router = Router();
const providerPetController = new ProviderPetController();

router.get(
    "/assigned",
    authorizedMiddleware,
    providerMiddleware,
    (req, res) => providerPetController.getAssignedPets(req, res),
);

export default router;

