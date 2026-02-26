import mongoose, { Document, Schema } from "mongoose";
import { FeedbackType } from "../../types/provider/feedback.type";

const FeedbackSchema: Schema = new Schema(
    {
        feedback: { type: String, required: true },
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true, index: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: false, index: true },
    },
    {
        timestamps: true,
    }
);

FeedbackSchema.index({ providerId: 1, createdAt: -1 });
FeedbackSchema.index({ providerId: 1, bookingId: 1 }, { unique: true, sparse: true });

FeedbackSchema.virtual("id").get(function (this: IFeedback) {
    return this._id.toHexString();
});

FeedbackSchema.set("toJSON", { virtuals: true });

export interface IFeedback extends FeedbackType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const FeedbackModel = mongoose.model<IFeedback>("Feedback", FeedbackSchema);
