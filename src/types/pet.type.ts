import z from "zod";

export const PetSchema = z.object({
    name: z.string().min(1),
    species: z.string().min(1),
    breed: z.string().optional(),
    age: z.coerce.number().int().nonnegative().optional(),
    weight: z.coerce.number().nonnegative().optional(),
    imageUrl: z.string().optional(),
    ownerId: z.string().optional()
    ,
    allergies: z.string().optional(),
    dietNotes: z.string().optional()
});

export type PetType = z.infer<typeof PetSchema>;