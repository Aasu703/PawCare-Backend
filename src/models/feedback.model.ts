import mongoose, { Document, Schema } from "mongoose";
import { FeedbackType } from "../types/feedback.type";

const FeedbackSchema: Schema = new Schema<FeedbackType>(
    {
        feedback: { type: String, required: true },
        providerId: { type: String, required: true },
        userId: { type: String, required: false }
    },
    {
        timestamps: true,
    }
);

FeedbackSchema.virtual("id").get(function (this: IFeedback) {
    return this._id.toHexString();
});

FeedbackSchema.set("toJSON", { virtuals: true });

export interface IFeedback extends FeedbackType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const FeedbackModel = mongoose.model<IFeedback>("Feedback", FeedbackSchema);
