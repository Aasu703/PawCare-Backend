import mongoose, { Document, Schema } from "mongoose";
import { MessageType } from "../../types/user/message.type";

const MessageSchema: Schema = new Schema(
    {
        content: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }
    },
    {
        timestamps: true,
    }
);

MessageSchema.index({ userId: 1, createdAt: -1 });

MessageSchema.virtual("id").get(function (this: IMessage) {
    return this._id.toHexString();
});

MessageSchema.set("toJSON", { virtuals: true });

export interface IMessage extends MessageType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
