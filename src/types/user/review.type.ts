import z from "zod";

export const ReviewSchema = z.object({
    id: z.string().optional(),
    rating: z.coerce.number().int().min(0).max(5),
    comment: z.string().optional(),
    userId: z.string().optional(),
    providerId: z.string().optional(),
    providerServiceId: z.string().optional(),
    productId: z.string().optional(),
    bookingId: z.string().optional(),
    reviewType: z.enum(["provider", "product", "general"]).default("general"),
    createdAt: z.string().optional()
});

export type ReviewType = z.infer<typeof ReviewSchema>;
