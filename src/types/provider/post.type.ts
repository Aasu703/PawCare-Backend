import z from "zod";

export const PostSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    content: z.string().min(1),
    providerId: z.string(),
    providerName: z.string().optional(),
    isPublic: z.boolean().default(true),
    createdAt: z.string().optional(),
});

export type PostType = z.infer<typeof PostSchema>;
