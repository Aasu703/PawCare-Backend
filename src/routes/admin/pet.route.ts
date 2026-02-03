import { Router } from "express";
import { PetController } from "../../controller/pet.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";
import { uploads } from "../../middleware/upload.middleware";
import { Request, Response } from "express";

const router: Router = Router();
const petController = new PetController();

// Create pet (admin only)
router.post(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    uploads.single("image"),
    (req: Request, res: Response) => petController.createPet(req, res)
);

// Get all pets (admin only)
router.get(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    (req: Request, res: Response) => petController.getAllPets(req, res)
);

// Get pet by ID (admin only)
router.get(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req: Request, res: Response) => petController.getPetById(req, res)
);

// Update pet (admin only)
router.put(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    uploads.single("image"),
    (req: Request, res: Response) => petController.updatePet(req, res)
);

// Delete pet (admin only)
router.delete(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req: Request, res: Response) => petController.deletePet(req, res)
);

export default router;
