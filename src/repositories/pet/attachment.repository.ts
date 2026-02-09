import { AttachmentModel, IAttachment } from "../../models/pet/attachment.model";
import { CreateAttachmentDto, UpdateAttachmentDto } from "../../dtos/pet/attachment.dto";

export class AttachmentRepository {
    async createAttachment(data: CreateAttachmentDto): Promise<IAttachment> {
        return AttachmentModel.create(data);
    }

    async getAttachmentById(id: string): Promise<IAttachment | null> {
        return AttachmentModel.findById(id).exec();
    }

    async getAttachmentsByHealthRecordId(healthRecordId: string): Promise<IAttachment[]> {
        return AttachmentModel.find({ healthRecordId }).exec();
    }

    async updateAttachmentById(id: string, updates: UpdateAttachmentDto): Promise<IAttachment | null> {
        return AttachmentModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteAttachmentById(id: string): Promise<IAttachment | null> {
        return AttachmentModel.findByIdAndDelete(id).exec();
    }

    async deleteAttachmentsByHealthRecordId(healthRecordId: string): Promise<void> {
        await AttachmentModel.deleteMany({ healthRecordId }).exec();
    }
}
