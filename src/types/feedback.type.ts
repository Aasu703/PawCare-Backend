import z from "zod";

export const FeedbackSchema = z.object({
    id: z.string().optional(),
    feedback: z.string().min(1),
    providerId: z.string().optional(),
    userId: z.string().optional(),
    createdAt: z.string().optional()
});

export type FeedbackType = z.infer<typeof FeedbackSchema>;
