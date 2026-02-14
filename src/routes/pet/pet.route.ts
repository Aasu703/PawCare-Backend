import { Router } from "express";
import { PetController } from "../../controller/pet/pet.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";
import { uploads } from "../../middleware/upload.middleware";

const router = Router();
const petController = new PetController();

router.post(
    "/",
    authorizedMiddleware,
    uploads.single("image"),
    (req, res) => petController.createPet(req, res)
);

router.get(
    "/",
    authorizedMiddleware,
    (req, res) => petController.getMyPets(req, res)
);

router.get(
    "/:id",
    authorizedMiddleware,
    (req, res) => petController.getPetById(req, res)
);

router.put(
    "/:id",
    authorizedMiddleware,
    uploads.single("image"),
    (req, res) => petController.updatePet(req, res)
);

router.delete(
    "/:id",
    authorizedMiddleware,
    (req, res) => petController.deletePet(req, res)
);

export default router;