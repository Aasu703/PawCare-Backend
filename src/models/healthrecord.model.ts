import mongoose, { Document, Schema } from "mongoose";
import { HealthRecordType } from "../types/healthrecord.type";

const HealthRecordSchema: Schema = new Schema<HealthRecordType>(
    {
        recordType: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: false },
        date: { type: String, required: true },
        nextDueDate: { type: String, required: false },
        attachmentsCount: { type: Number, default: 0 },
        petId: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

HealthRecordSchema.virtual("id").get(function (this: IHealthRecord) {
    return this._id.toHexString();
});

HealthRecordSchema.set("toJSON", { virtuals: true });

export interface IHealthRecord extends HealthRecordType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const HealthRecordModel = mongoose.model<IHealthRecord>("HealthRecord", HealthRecordSchema);
