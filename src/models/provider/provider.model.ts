import mongoose, {Document, Schema} from "mongoose";

export type ProviderLocation = {
    latitude: number;
    longitude: number;
    address?: string;
};

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
        certification: { type: String, default: "" },
        certificationDocumentUrl: { type: String, default: "" },
        experience: { type: String, default: "" },
        clinicOrShopName: { type: String, default: "" },
        panNumber: { type: String, default: "" },
        location: {
            type: new Schema(
                {
                    latitude: { type: Number, min: -90, max: 90 },
                    longitude: { type: Number, min: -180, max: 180 },
                    address: { type: String, default: "" },
                },
                { _id: false }
            ),
            default: undefined,
        },
        locationUpdatedAt: { type: Date, default: null },
        locationVerified: { type: Boolean, default: false },
        locationVerifiedAt: { type: Date, default: null },
        locationVerifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        pawcareVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

ProviderSchema.index({ status: 1, providerType: 1, pawcareVerified: 1, createdAt: -1 });

export interface IProvider extends Document {
    _id: mongoose.Types.ObjectId;
    businessName: string;
    address: string;
    phone?: string;
    rating?: number;
    userId?: mongoose.Types.ObjectId | string | null;
    email: string;
    password: string;
    role: "provider";
    providerType?: "shop" | "vet" | "babysitter";
    status: "pending" | "approved" | "rejected";
    certification?: string;
    certificationDocumentUrl?: string;
    experience?: string;
    clinicOrShopName?: string;
    panNumber?: string;
    location?: ProviderLocation;
    locationUpdatedAt?: Date | null;
    locationVerified?: boolean;
    locationVerifiedAt?: Date | null;
    locationVerifiedBy?: mongoose.Types.ObjectId | string | null;
    pawcareVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const ProviderModel = mongoose.model<IProvider>("Provider", ProviderSchema);
// ProviderModel will be used to interact with the providers collection in MongoDB
// It provides methods to create, read, update, and delete provider documents
