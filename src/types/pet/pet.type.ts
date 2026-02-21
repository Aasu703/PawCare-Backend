import z from "zod";

export const PetCareFeedingTimeSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Feeding time must be in HH:mm format");

export const PetVaccinationStatusSchema = z.enum(["pending", "done", "not_required"]);

export const PetVaccinationSchema = z.object({
    vaccine: z.string().min(1),
    recommendedByMonths: z.coerce.number().int().nonnegative().optional(),
    dosesTaken: z.coerce.number().int().nonnegative().default(0),
    status: PetVaccinationStatusSchema.default("pending"),
});

export const PetCareSchema = z.object({
    feedingTimes: z.array(PetCareFeedingTimeSchema).max(12).default([]),
    vaccinations: z.array(PetVaccinationSchema).max(40).default([]),
    notes: z.string().max(500).optional(),
    updatedAt: z.coerce.date().optional(),
});

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
    dietNotes: z.string().optional(),
    care: PetCareSchema.optional(),
});

export type PetType = z.infer<typeof PetSchema>;
export type PetCareType = z.infer<typeof PetCareSchema>;
export type PetVaccinationType = z.infer<typeof PetVaccinationSchema>;
