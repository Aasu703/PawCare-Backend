import { CreatePetDto, UpdatePetCareDto, UpdatePetDto } from "../../dtos/pet/pet.dto";
import { HttpError } from "../../errors/http-error";
import { PetRepository } from "../../repositories/pet/pet.repository";

const petRepository = new PetRepository();

export class PetService {
    private normalizePetCare(pet: any) {
        const care = pet?.care || {};
        return {
            feedingTimes: Array.isArray(care.feedingTimes) ? care.feedingTimes : [],
            vaccinations: Array.isArray(care.vaccinations) ? care.vaccinations : [],
            notes: typeof care.notes === "string" ? care.notes : "",
            updatedAt: care.updatedAt || null,
        };
    }

    async createPet(ownerId: string, data: CreatePetDto) {
        if (!ownerId) {
            throw new HttpError(400, "Owner ID is required");
        }
        return petRepository.createPet(ownerId, data);
    }

    async getPetById(petId: string, ownerId: string, role?: string) {
        if (!petId) {
            throw new HttpError(400, "Pet ID is required");
        }
        const pet = await petRepository.getPetById(petId);
        if (!pet) {
            throw new HttpError(404, "Pet not found");
        }
        if (role !== "admin" && pet.ownerId?.toString() !== ownerId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        return pet;
    }

    async getAllPetsForUser(ownerId: string) {
        if (!ownerId) {
            throw new HttpError(400, "Owner ID is required");
        }
        return petRepository.getPetsByOwnerId(ownerId);
    }

    async getAllPets() {
        // Admin method - get all pets from all users
        return petRepository.getAllPets();
    }

    async updatePet(petId: string, ownerId: string, data: UpdatePetDto, role?: string) {
        const existing = await this.getPetById(petId, ownerId, role);
        if (!existing) {
            throw new HttpError(404, "Pet not found");
        }
        const updated = await petRepository.updatePetById(petId, data);
        if (!updated) {
            throw new HttpError(404, "Pet not found");
        }
        return updated;
    }

    async getPetCare(petId: string, ownerId: string, role?: string) {
        const pet = await this.getPetById(petId, ownerId, role);
        return this.normalizePetCare(pet);
    }

    async updatePetCare(petId: string, ownerId: string, data: UpdatePetCareDto, role?: string) {
        const existing = await this.getPetById(petId, ownerId, role);
        if (!existing) {
            throw new HttpError(404, "Pet not found");
        }
        const updated = await petRepository.updatePetCareById(petId, data);
        if (!updated) {
            throw new HttpError(404, "Pet not found");
        }
        return this.normalizePetCare(updated);
    }

    async deletePet(petId: string, ownerId: string, role?: string) {
        const existing = await this.getPetById(petId, ownerId, role);
        if (!existing) {
            throw new HttpError(404, "Pet not found");
        }
        const deleted = await petRepository.deletePetById(petId);
        if (!deleted) {
            throw new HttpError(404, "Pet not found");
        }
        return deleted;
    }
}
