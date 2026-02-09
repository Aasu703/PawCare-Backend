import { CreateAttachmentDto, UpdateAttachmentDto } from "../../dtos/pet/attachment.dto";
import { HttpError } from "../../errors/http-error";
import { AttachmentRepository } from "../../repositories/pet/attachment.repository";
import { HealthRecordRepository } from "../../repositories/pet/healthrecord.repository";

const attachmentRepository = new AttachmentRepository();
const healthRecordRepository = new HealthRecordRepository();

export class AttachmentService {
    async createAttachment(data: CreateAttachmentDto) {
        if (!data.healthRecordId) {
            throw new HttpError(400, "Health Record ID is required");
        }
        const record = await healthRecordRepository.getHealthRecordById(data.healthRecordId);
        if (!record) {
            throw new HttpError(404, "Health record not found");
        }
        const attachment = await attachmentRepository.createAttachment(data);
        await healthRecordRepository.incrementAttachmentsCount(data.healthRecordId);
        return attachment;
    }

    async getAttachmentById(id: string) {
        const attachment = await attachmentRepository.getAttachmentById(id);
        if (!attachment) {
            throw new HttpError(404, "Attachment not found");
        }
        return attachment;
    }

    async getAttachmentsByHealthRecordId(healthRecordId: string) {
        return attachmentRepository.getAttachmentsByHealthRecordId(healthRecordId);
    }

    async updateAttachment(id: string, data: UpdateAttachmentDto) {
        const updated = await attachmentRepository.updateAttachmentById(id, data);
        if (!updated) {
            throw new HttpError(404, "Attachment not found");
        }
        return updated;
    }

    async deleteAttachment(id: string) {
        const existing = await attachmentRepository.getAttachmentById(id);
        if (!existing) {
            throw new HttpError(404, "Attachment not found");
        }
        const deleted = await attachmentRepository.deleteAttachmentById(id);
        if (deleted && existing.healthRecordId) {
            await healthRecordRepository.decrementAttachmentsCount(existing.healthRecordId);
        }
        return deleted;
    }
}
