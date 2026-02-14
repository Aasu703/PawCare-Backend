import mongoose, { Document, Schema } from "mongoose";
import { NotificationType } from "../../types/user/notification.type";

const NotificationModelSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        title: { type: String, required: true },
        body: { type: String, required: true },
        type: {
            type: String,
            enum: ["booking", "order", "system", "service", "message"],
            default: "system",
            index: true,
        },
        isRead: { type: Boolean, default: false, index: true },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

NotificationModelSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

NotificationModelSchema.virtual("id").get(function (this: INotification) {
    return this._id.toHexString();
});
NotificationModelSchema.set("toJSON", { virtuals: true });

export interface INotification extends NotificationType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const NotificationModel = mongoose.model<INotification>("Notification", NotificationModelSchema);
