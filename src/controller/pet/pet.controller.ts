import { Request, Response } from "express";
import z from "zod";
import { CreatePetDto, UpdatePetDto } from "../../dtos/pet/pet.dto";
import { PetService } from "../../services/pet/pet.service";

const petService = new PetService();

export class PetController {
    async createPet(req: Request, res: Response) {
        try {
            const ownerId = req.user?._id;
            if (!ownerId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const parsed = CreatePetDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            if (req.file) {
                parsed.data.imageUrl = `/uploads/${req.file.filename}`;
            }
            const pet = await petService.createPet(ownerId, parsed.data);
            return res.status(201).json({ success: true, message: "Pet created", data: pet });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getMyPets(req: Request, res: Response) {
        try {
            const ownerId = req.user?._id;
            if (!ownerId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const pets = await petService.getAllPetsForUser(ownerId);
            return res.status(200).json({ success: true, data: pets });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getAllPets(req: Request, res: Response) {
        try {
            // Admin only - get all pets from all users
            const pets = await petService.getAllPets();
            return res.status(200).json({ success: true, data: pets });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getPetById(req: Request, res: Response) {
        try {
            const ownerId = req.user?._id;
            const role = req.user?.role;
            if (!ownerId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const petId = req.params.id;
            const pet = await petService.getPetById(petId, ownerId, role);
            return res.status(200).json({ success: true, data: pet });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async updatePet(req: Request, res: Response) {
        try {
            const ownerId = req.user?._id;
            const role = req.user?.role;
            if (!ownerId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const petId = req.params.id;
            const parsed = UpdatePetDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            if (req.file) {
                parsed.data.imageUrl = `/uploads/${req.file.filename}`;
            }
            const pet = await petService.updatePet(petId, ownerId, parsed.data, role);
            return res.status(200).json({ success: true, message: "Pet updated", data: pet });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async deletePet(req: Request, res: Response) {
        try {
            const ownerId = req.user?._id;
            const role = req.user?.role;
            if (!ownerId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const petId = req.params.id;
            await petService.deletePet(petId, ownerId, role);
            return res.status(200).json({ success: true, message: "Pet deleted" });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}
