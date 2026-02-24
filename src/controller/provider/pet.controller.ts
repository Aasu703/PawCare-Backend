import { Request, Response } from "express";
import { PetService } from "../../services/pet/pet.service";

const petService = new PetService();

export class ProviderPetController {
    async getAssignedPets(req: Request, res: Response) {
        try {
            const providerId = ((req as any).provider?._id || req.user?._id || req.user?.id || "").toString();
            const role = req.user?.role;
            if (!providerId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const pets = await petService.getAssignedPetsForVet(providerId, role);
            return res.status(200).json({
                success: true,
                message: "Assigned pets fetched",
                data: pets,
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

