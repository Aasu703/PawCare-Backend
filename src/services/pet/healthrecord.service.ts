import { CreateHealthRecordDto, UpdateHealthRecordDto } from "../../dtos/pet/healthrecord.dto";
import { HttpError } from "../../errors/http-error";
import { HealthRecordRepository } from "../../repositories/pet/healthrecord.repository";
import { PetRepository } from "../../repositories/pet/pet.repository";

const healthRecordRepository = new HealthRecordRepository();
const petRepository = new PetRepository();

export class HealthRecordService {
    async createHealthRecord(data: CreateHealthRecordDto, userId: string, role?: string) {
        // Verify the pet exists and belongs to the user (or user is admin)
        if (!data.petId) {
            throw new HttpError(400, "Pet ID is required");
        }
        const pet = await petRepository.getPetById(data.petId);
        if (!pet) {
            throw new HttpError(404, "Pet not found");
        }
        if (role !== "admin" && pet.ownerId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden: not your pet");
        }
        return healthRecordRepository.createHealthRecord(data);
    }

    async getHealthRecordById(id: string) {
        const record = await healthRecordRepository.getHealthRecordById(id);
        if (!record) {
            throw new HttpError(404, "Health record not found");
        }
        return record;
    }

    async getHealthRecordsByPetId(petId: string, userId: string, role?: string) {
        const pet = await petRepository.getPetById(petId);
        if (!pet) {
            throw new HttpError(404, "Pet not found");
        }
        if (role !== "admin" && pet.ownerId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden: not your pet");
        }
        return healthRecordRepository.getHealthRecordsByPetId(petId);
    }

    async getAllHealthRecords(page: number = 1, limit: number = 10) {
        return healthRecordRepository.getAllHealthRecords(page, limit);
    }

    async updateHealthRecord(id: string, userId: string, data: UpdateHealthRecordDto, role?: string) {
        const existing = await healthRecordRepository.getHealthRecordById(id);
        if (!existing) {
            throw new HttpError(404, "Health record not found");
        }
        // Verify ownership through the pet
        if (existing.petId) {
            const pet = await petRepository.getPetById(existing.petId);
            if (pet && role !== "admin" && pet.ownerId?.toString() !== userId?.toString()) {
                throw new HttpError(403, "Forbidden");
            }
        }
        const updated = await healthRecordRepository.updateHealthRecordById(id, data);
        if (!updated) {
            throw new HttpError(404, "Health record not found");
        }
        return updated;
    }

    async deleteHealthRecord(id: string, userId: string, role?: string) {
        const existing = await healthRecordRepository.getHealthRecordById(id);
        if (!existing) {
            throw new HttpError(404, "Health record not found");
        }
        if (existing.petId) {
            const pet = await petRepository.getPetById(existing.petId);
            if (pet && role !== "admin" && pet.ownerId?.toString() !== userId?.toString()) {
                throw new HttpError(403, "Forbidden");
            }
        }
        const deleted = await healthRecordRepository.deleteHealthRecordById(id);
        if (!deleted) {
            throw new HttpError(404, "Health record not found");
        }
        return deleted;
    }
}
