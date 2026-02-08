import z from "zod";

export const HealthRecordSchema = z.object({
    id: z.string().optional(),
    recordType: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    nextDueDate: z.string().optional(),
    attachmentsCount: z.coerce.number().int().optional(),
    petId: z.string().optional(),
    createdAt: z.string().optional()
});

export type HealthRecordType = z.infer<typeof HealthRecordSchema>;
