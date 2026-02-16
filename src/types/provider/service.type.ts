import z from "zod";
import { de } from "zod/v4/locales";

export const ServiceSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2),
    description: z.string().min(5).optional(),
    price: z.coerce.number().nonnegative(),
    duration_minutes: z.coerce.number().int().nonnegative(),
    category: z.enum(["grooming", "boarding", "vet"]).optional(),
    availability: z.array(z.string()).optional(), // e.g., ["Monday 9-5", "Tuesday 9-5"]
    providerId: z.string().optional()
})

export type ServiceType = z.infer<typeof ServiceSchema>;
