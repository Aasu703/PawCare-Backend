import mongoose, { Document, Schema } from "mongoose";
import { OrderType } from "../../types/user/order.type";

const OrderItemSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
}, { _id: false });

const OrderSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        items: { type: [OrderItemSchema], required: true },
        totalAmount: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        shippingAddress: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

OrderSchema.virtual("id").get(function (this: IOrder) {
    return this._id.toHexString();
});
OrderSchema.set("toJSON", { virtuals: true });

export interface IOrder extends OrderType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
