import z from "zod";
import {
    PetCareFeedingTimeSchema,
    PetSchema,
    PetVaccinationSchema,
} from "../../types/pet/pet.type";

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

export const UpdatePetCareDto = z.object({
    feedingTimes: z.array(PetCareFeedingTimeSchema).max(12).optional(),
    vaccinations: z.array(PetVaccinationSchema).max(40).optional(),
    notes: z.string().max(500).optional(),
});
export type UpdatePetCareDto = z.infer<typeof UpdatePetCareDto>;
