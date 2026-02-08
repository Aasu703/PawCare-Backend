import z from "zod";

export const ReviewSchema = z.object({
    id: z.string().optional(),
    rating: z.coerce.number().int().min(0).max(5),
    comment: z.string().optional(),
    userId: z.string().optional(),
    createdAt: z.string().optional()
});

export type ReviewType = z.infer<typeof ReviewSchema>;
