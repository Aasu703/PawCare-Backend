import z from "zod";

export const NotificationSchema = z.object({
    id: z.string().optional(),
    userId: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
    type: z.enum(["booking", "order", "system", "service", "message"]).default("system"),
    isRead: z.boolean().default(false),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.string().optional(),
});

export type NotificationType = z.infer<typeof NotificationSchema>;
