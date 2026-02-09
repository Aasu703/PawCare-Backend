import { HealthRecordModel, IHealthRecord } from "../../models/pet/healthrecord.model";
import { CreateHealthRecordDto, UpdateHealthRecordDto } from "../../dtos/pet/healthrecord.dto";

export class HealthRecordRepository {
    async createHealthRecord(data: CreateHealthRecordDto): Promise<IHealthRecord> {
        return HealthRecordModel.create(data);
    }

    async getHealthRecordById(id: string): Promise<IHealthRecord | null> {
        return HealthRecordModel.findById(id).exec();
    }

    async getHealthRecordsByPetId(petId: string): Promise<IHealthRecord[]> {
        return HealthRecordModel.find({ petId }).sort({ date: -1 }).exec();
    }

    async getAllHealthRecords(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            HealthRecordModel.find().skip(skip).limit(limit).exec(),
            HealthRecordModel.countDocuments().exec()
        ]);
        return { records, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async updateHealthRecordById(id: string, updates: UpdateHealthRecordDto): Promise<IHealthRecord | null> {
        return HealthRecordModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteHealthRecordById(id: string): Promise<IHealthRecord | null> {
        return HealthRecordModel.findByIdAndDelete(id).exec();
    }

    async incrementAttachmentsCount(id: string): Promise<IHealthRecord | null> {
        return HealthRecordModel.findByIdAndUpdate(id, { $inc: { attachmentsCount: 1 } }, { new: true }).exec();
    }

    async decrementAttachmentsCount(id: string): Promise<IHealthRecord | null> {
        return HealthRecordModel.findByIdAndUpdate(id, { $inc: { attachmentsCount: -1 } }, { new: true }).exec();
    }
}
