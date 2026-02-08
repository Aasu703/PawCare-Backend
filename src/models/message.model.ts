import mongoose, { Document, Schema } from "mongoose";
import { MessageType } from "../types/message.type";

const MessageSchema: Schema = new Schema<MessageType>(
    {
        content: { type: String, required: true },
        userId: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

MessageSchema.virtual("id").get(function (this: IMessage) {
    return this._id.toHexString();
});

MessageSchema.set("toJSON", { virtuals: true });

export interface IMessage extends MessageType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
