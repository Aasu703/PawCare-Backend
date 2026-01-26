import z from "zod";

export const ProviderSchema = z.object({
    businessName: z.string().min(2),
    address: z.string().min(5),
    phone: z.string().min(10).optional(),
    rating: z.number().min(0).max(5).optional(),
});

export type ProviderType = z.infer<typeof ProviderSchema>;