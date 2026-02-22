import z from "zod";

const ProviderLocationSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
});

export const ProviderSchema = z.object({
    businessName: z.string().min(2),
    address: z.string().min(5),
    phone: z.string().min(10).optional(),
    rating: z.number().min(0).max(5).optional(),
    userId: z.string().optional(),
    userId2: z.string().optional(),
    role: z.enum(["provider"]).default("provider"),
    providerType: z.enum(["shop", "vet", "babysitter"]).optional(),
    status: z.enum(["pending", "approved", "rejected"]).default("pending"),
    certification: z.string().optional(),
    certificationDocumentUrl: z.string().optional(),
    experience: z.string().optional(),
    clinicOrShopName: z.string().optional(),
    panNumber: z.string().optional(),
    location: ProviderLocationSchema.optional(),
    locationUpdatedAt: z.string().optional(),
    locationVerified: z.boolean().optional(),
    locationVerifiedAt: z.string().optional(),
    locationVerifiedBy: z.string().optional(),
    pawcareVerified: z.boolean().optional(),
    avatarUrl: z.string().optional(),
    createdAt: z.string().optional()
});

export type ProviderType = z.infer<typeof ProviderSchema>;
