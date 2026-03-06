import { CreateHealthRecordDto, UpdateHealthRecordDto } from "../../dtos/pet/healthrecord.dto";
import { HttpError } from "../../errors/http-error";
import { HealthRecordRepository } from "../../repositories/pet/healthrecord.repository";
import { PetRepository } from "../../repositories/pet/pet.repository";
import { ProviderRepository } from "../../repositories/provider/provider.repository";
import { BookingRepository } from "../../repositories/user/booking.repository";

export class HealthRecordService {
    constructor(
        private healthRecordRepository = new HealthRecordRepository(),
        private petRepository = new PetRepository(),
        private providerRepository = new ProviderRepository(),
        private bookingRepository = new BookingRepository()
    ) {}

    async createHealthRecord(data: CreateHealthRecordDto, userId: string, role?: string) {
        // Verify the pet exists and ownership/permission rules.
        if (!data.petId) {
            throw new HttpError(400, "Pet ID is required");
        }
        const pet = await this.petRepository.getPetById(data.petId);
        if (!pet) {
            throw new HttpError(404, "Pet not found");
        }
        if (role === "admin") {
            return this.healthRecordRepository.createHealthRecord(data);
        }

        if (role === "provider") {
            const provider = await this.providerRepository.getProviderById(userId);
            if (!provider) {
                throw new HttpError(403, "Provider not found");
            }
            if (provider.providerType !== "vet") {
                throw new HttpError(403, "Only vet providers can add checkup reports");
            }
            const hasAuthorizedBooking = await this.bookingRepository.hasConfirmedVetBookingForProvider(userId, data.petId);
            if (!hasAuthorizedBooking) {
                throw new HttpError(403, "No confirmed/completed vet booking found for this pet");
            }
            return this.healthRecordRepository.createHealthRecord(data);
        }

        if (pet.ownerId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden: not your pet");
        }
        return this.healthRecordRepository.createHealthRecord(data);
    }

    async getHealthRecordById(id: string) {
        const record = await this.healthRecordRepository.getHealthRecordById(id);
        if (!record) {
            throw new HttpError(404, "Health record not found");
        }
        return record;
    }

    async getHealthRecordsByPetId(petId: string, userId: string, role?: string) {
        const pet = await this.petRepository.getPetById(petId);
        if (!pet) {
            throw new HttpError(404, "Pet not found");
        }

        if (role === "admin") {
            return this.healthRecordRepository.getHealthRecordsByPetId(petId);
        }

        if (role === "provider") {
            const provider = await this.providerRepository.getProviderById(userId);
            if (!provider) {
                throw new HttpError(403, "Provider not found");
            }
            if (provider.providerType !== "vet") {
                throw new HttpError(403, "Only vet providers can view pet health records");
            }
            const hasAuthorizedBooking = await this.bookingRepository.hasConfirmedVetBookingForProvider(userId, petId);
            if (!hasAuthorizedBooking) {
                throw new HttpError(403, "No confirmed/completed vet booking found for this pet");
            }
            return this.healthRecordRepository.getHealthRecordsByPetId(petId);
        }

        if (pet.ownerId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden: not your pet");
        }

        return this.healthRecordRepository.getHealthRecordsByPetId(petId);
    }

    async getAllHealthRecords(page: number = 1, limit: number = 10) {
        return this.healthRecordRepository.getAllHealthRecords(page, limit);
    }

    async updateHealthRecord(id: string, userId: string, data: UpdateHealthRecordDto, role?: string) {
        const existing = await this.healthRecordRepository.getHealthRecordById(id);
        if (!existing) {
            throw new HttpError(404, "Health record not found");
        }
        // Verify ownership through the pet
        if (existing.petId) {
            const pet = await this.petRepository.getPetById(existing.petId);
            if (pet && role !== "admin" && pet.ownerId?.toString() !== userId?.toString()) {
                throw new HttpError(403, "Forbidden");
            }
        }
        const updated = await this.healthRecordRepository.updateHealthRecordById(id, data);
        if (!updated) {
            throw new HttpError(404, "Health record not found");
        }
        return updated;
    }

    async deleteHealthRecord(id: string, userId: string, role?: string) {
        const existing = await this.healthRecordRepository.getHealthRecordById(id);
        if (!existing) {
            throw new HttpError(404, "Health record not found");
        }
        if (existing.petId) {
            const pet = await this.petRepository.getPetById(existing.petId);
            if (pet && role !== "admin" && pet.ownerId?.toString() !== userId?.toString()) {
                throw new HttpError(403, "Forbidden");
            }
        }
        const deleted = await this.healthRecordRepository.deleteHealthRecordById(id);
        if (!deleted) {
            throw new HttpError(404, "Health record not found");
        }
        return deleted;
    }
}
