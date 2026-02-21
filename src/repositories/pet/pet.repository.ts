import { CreatePetDto, UpdatePetCareDto, UpdatePetDto } from "../../dtos/pet/pet.dto";
import { IPet, PetModel } from "../../models/pet/pet.model";

export class PetRepository {
    async createPet(ownerId: string, data: CreatePetDto): Promise<IPet> {
        const pet = await PetModel.create({
            ...data,
            ownerId
        });
        return pet;
    }

    async getPetById(petId: string): Promise<IPet | null> {
        return PetModel.findById(petId).exec();
    }

    async getPetsByOwnerId(ownerId: string): Promise<IPet[]> {
        return PetModel.find({ ownerId }).exec();
    }

    async getAllPets(): Promise<IPet[]> {
        return PetModel.find({}).exec();
    }

    async updatePetById(petId: string, updates: UpdatePetDto): Promise<IPet | null> {
        return PetModel.findByIdAndUpdate(petId, updates, { new: true }).exec();
    }

    async updatePetCareById(petId: string, updates: UpdatePetCareDto): Promise<IPet | null> {
        const patch: Record<string, unknown> = {
            "care.updatedAt": new Date(),
        };

        if (Array.isArray(updates.feedingTimes)) {
            patch["care.feedingTimes"] = updates.feedingTimes;
        }

        if (Array.isArray(updates.vaccinations)) {
            patch["care.vaccinations"] = updates.vaccinations;
        }

        if (typeof updates.notes !== "undefined") {
            patch["care.notes"] = updates.notes;
        }

        return PetModel.findByIdAndUpdate(
            petId,
            { $set: patch },
            { new: true },
        ).exec();
    }

    async deletePetById(petId: string): Promise<IPet | null> {
        return PetModel.findByIdAndDelete(petId).exec();
    }
}
