import { Router, Request, Response } from "express";
import healthRecordController from "../controller/pet/healthrecord.controller";
import { authorizedMiddleware } from "../middleware/authorization.middleware";

const router: Router = Router();

// Create a health record
router.post("/", authorizedMiddleware, (req: Request, res: Response) =>
    healthRecordController.create(req, res)
);

// Get health records by pet ID
router.get("/pet/:petId", authorizedMiddleware, (req: Request, res: Response) =>
    healthRecordController.getByPetId(req, res)
);

// Get health record by ID
router.get("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    healthRecordController.getById(req, res)
);

// Update health record
router.put("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    healthRecordController.update(req, res)
);

// Delete health record
router.delete("/:id", authorizedMiddleware, (req: Request, res: Response) =>
    healthRecordController.remove(req, res)
);

export default router;
