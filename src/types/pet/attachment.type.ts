import z from "zod";

export const AttachmentSchema = z.object({
    id: z.string().optional(),
    fileName: z.string().min(1),
    fileUrl: z.string().min(1),
    healthRecordId: z.string().optional(),
    createdAt: z.string().optional()
});

export type AttachmentType = z.infer<typeof AttachmentSchema>;
