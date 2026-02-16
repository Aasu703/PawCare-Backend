import mongoose, { Document, Schema } from "mongoose";
import { PostType } from "../../types/provider/post.type";

const PostSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        providerId: { type: String, required: true },
        providerName: { type: String },
        isPublic: { type: Boolean, default: true },
    },
    { timestamps: true }
);

PostSchema.virtual("id").get(function (this: IPost) {
    return this._id.toHexString();
});
PostSchema.set("toJSON", { virtuals: true });

export interface IPost extends PostType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const PostModel = mongoose.model<IPost>("Post", PostSchema);
