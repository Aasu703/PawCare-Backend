import mongoose, { Document, Schema } from "mongoose";
import { CartType } from "../../types/user/cart.type";

const CartItemSchema: Schema = new Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        price: { type: Number, required: true, min: 0 },
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
    }
);

const CartSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        items: { type: [CartItemSchema], default: [] },
    },
    { timestamps: true }
);

CartSchema.index({ userId: 1 });

CartSchema.virtual("id").get(function (this: ICart) {
    return this._id.toHexString();
});
CartSchema.set("toJSON", { virtuals: true });

export interface ICart extends CartType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const CartModel = mongoose.model<ICart>("Cart", CartSchema);
