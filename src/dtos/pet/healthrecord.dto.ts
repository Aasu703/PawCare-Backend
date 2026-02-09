import z from "zod";
import { HealthRecordSchema } from "../../types/pet/healthrecord.type";

export const CreateHealthRecordDto = HealthRecordSchema.pick({
    recordType: true,
    title: true,
    description: true,
    date: true,
    nextDueDate: true,
    petId: true
});

export type CreateHealthRecordDto = z.infer<typeof CreateHealthRecordDto>;

export const UpdateHealthRecordDto = HealthRecordSchema.partial().omit({ id: true, petId: true });
export type UpdateHealthRecordDto = z.infer<typeof UpdateHealthRecordDto>;
