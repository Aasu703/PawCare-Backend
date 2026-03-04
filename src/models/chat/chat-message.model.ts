import mongoose, { Document, Schema } from "mongoose";

export type ChatRole = "user" | "provider";

interface ChatMessageType {
    content: string;
    senderId: mongoose.Types.ObjectId;
    senderRole: ChatRole;
    receiverId: mongoose.Types.ObjectId;
    receiverRole: ChatRole;
    seenAt?: Date;
}

export interface IChatMessage extends ChatMessageType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

const ChatMessageSchema: Schema = new Schema(
    {
        content: { type: String, required: true, trim: true },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        senderRole: {
            type: String,
            enum: ["user", "provider"],
            required: true,
            index: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        receiverRole: {
            type: String,
            enum: ["user", "provider"],
            required: true,
            index: true,
        },
        seenAt: { type: Date, required: false },
    },
    { timestamps: true },
);

ChatMessageSchema.index({
    senderId: 1,
    senderRole: 1,
    receiverId: 1,
    receiverRole: 1,
    createdAt: -1,
});

ChatMessageSchema.index({
    receiverId: 1,
    receiverRole: 1,
    createdAt: -1,
});

ChatMessageSchema.virtual("id").get(function (this: IChatMessage) {
    return this._id.toHexString();
});

ChatMessageSchema.set("toJSON", { virtuals: true });

export const ChatMessageModel = mongoose.model<IChatMessage>(
    "ChatMessage",
    ChatMessageSchema,
);
