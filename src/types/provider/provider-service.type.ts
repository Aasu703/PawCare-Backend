import z from "zod";

export const ProviderServiceSchema = z.object({
    id: z.string().optional(),
    userId: z.string().min(1),
    serviceType: z.enum(["vet", "groomer", "boarding", "shop_owner"]),
    verificationStatus: z.enum(["pending", "approved", "rejected"]).default("pending"),
    documents: z.array(z.string()).default([]),
    registrationNumber: z.string().optional(),
    bio: z.string().optional(),
    experience: z.string().optional(),
    ratingAverage: z.coerce.number().nonnegative().optional(),
    ratingCount: z.coerce.number().int().nonnegative().optional(),
    earnings: z.coerce.number().nonnegative().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type ProviderServiceType = z.infer<typeof ProviderServiceSchema>;
