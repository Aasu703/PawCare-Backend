import z from "zod";
import { PetSchema } from "../../types/pet/pet.type";

export const CreatePetDto = PetSchema.pick({
    name: true,
    species: true,
    breed: true,
    age: true,
    weight: true,
    imageUrl: true
});

export type CreatePetDto = z.infer<typeof CreatePetDto>;

export const UpdatePetDto = PetSchema.partial().omit({ ownerId: true });
export type UpdatePetDto = z.infer<typeof UpdatePetDto>;