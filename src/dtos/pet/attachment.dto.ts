import z from "zod";
import { AttachmentSchema } from "../../types/pet/attachment.type";

export const CreateAttachmentDto = AttachmentSchema.pick({
    fileName: true,
    fileUrl: true,
    healthRecordId: true
});

export type CreateAttachmentDto = z.infer<typeof CreateAttachmentDto>;

export const UpdateAttachmentDto = AttachmentSchema.partial().omit({ id: true, healthRecordId: true });
export type UpdateAttachmentDto = z.infer<typeof UpdateAttachmentDto>;
