import { CreatePetDto, UpdatePetDto } from "../dtos/pet.dto";
import { IPet, PetModel } from "../models/pet.model";

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

    async deletePetById(petId: string): Promise<IPet | null> {
        return PetModel.findByIdAndDelete(petId).exec();
    }
}