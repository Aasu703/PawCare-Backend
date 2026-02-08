import mongoose, { Document, Schema } from "mongoose";
import { InventoryType } from "../types/inventory.type";

const InventorySchema: Schema = new Schema<InventoryType>(
    {
        product_name: { type: String, required: true },
        description: { type: String, required: false },
        quantity: { type: Number, default: 0 },
        price: { type: Number, required: false },
        category: { type: String, required: false },
        providerId: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

InventorySchema.virtual("id").get(function (this: IInventory) {
    return this._id.toHexString();
});

InventorySchema.set("toJSON", { virtuals: true });

export interface IInventory extends InventoryType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const InventoryModel = mongoose.model<IInventory>("Inventory", InventorySchema);
