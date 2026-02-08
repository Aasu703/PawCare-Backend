import mongoose, { Document, Schema } from "mongoose";
import { AttachmentType } from "../types/attachment.type";

const AttachmentSchema: Schema = new Schema<AttachmentType>(
    {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        healthRecordId: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

AttachmentSchema.virtual("id").get(function (this: IAttachment) {
    return this._id.toHexString();
});

AttachmentSchema.set("toJSON", { virtuals: true });

export interface IAttachment extends AttachmentType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const AttachmentModel = mongoose.model<IAttachment>("Attachment", AttachmentSchema);
