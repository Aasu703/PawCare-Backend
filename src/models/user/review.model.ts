import mongoose, { Document, Schema } from "mongoose";
import { ReviewType } from "../../types/user/review.type";

const ReviewSchema: Schema = new Schema<ReviewType>(
    {
        rating: { type: Number, required: true, min: 0, max: 5 },
        comment: { type: String, required: false },
        userId: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

ReviewSchema.virtual("id").get(function (this: IReview) {
    return this._id.toHexString();
});

ReviewSchema.set("toJSON", { virtuals: true });

export interface IReview extends ReviewType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
