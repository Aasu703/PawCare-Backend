import mongoose, {Document, Schema} from "mongoose";
import { ProviderType } from "../../types/provider/provider.type";

const ProviderSchema: Schema = new Schema(
    {
        businessName: {type: String, required: true},
        address: {type: String, required: true},
        phone: {type: String},
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true },
        email: {type: String, required: true, unique: true, lowercase: true, trim: true, index: true},
        password: {type: String, required: true},
        rating: {type: Number, default: 0},
        role: {type: String, enum: ["provider"], default: "provider"},
        providerType: {type: String, enum: ["shop", "vet", "babysitter"], default: null},
        status: {type: String, enum: ["pending", "approved", "rejected"], default: "pending"},
    },
    {
        timestamps: true,
    }
);

ProviderSchema.index({ status: 1, providerType: 1, createdAt: -1 });

export interface IProvider extends ProviderType, Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    role: "provider";
    providerType?: "shop" | "vet" | "babysitter";
    status: "pending" | "approved" | "rejected";
    createdAt?: string;
    updatedAt?: string;
}

export const ProviderModel = mongoose.model<IProvider>("Provider", ProviderSchema);
// ProviderModel will be used to interact with the providers collection in MongoDB
// It provides methods to create, read, update, and delete provider documents