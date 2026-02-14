import z from "zod";

export const MessageSchema = z.object({
    id: z.string().optional(),
    content: z.string().min(1),
    userId: z.string().optional(),
    createdAt: z.string().optional()
});

export type MessageType = z.infer<typeof MessageSchema>;
