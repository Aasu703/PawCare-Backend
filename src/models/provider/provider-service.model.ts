import mongoose, { Document, Schema } from "mongoose";
import { ProviderServiceType } from "../../types/provider/provider-service.type";

const ProviderServiceSchema: Schema = new Schema<ProviderServiceType>(
    {
        userId: { type: String, required: true, index: true },
        serviceType: {
            type: String,
            enum: ["vet", "groomer", "boarding", "shop_owner"],
            required: true,
            index: true,
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },
        documents: { type: [String], default: [] },
        registrationNumber: { type: String },
        bio: { type: String },
        experience: { type: String },
        ratingAverage: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
        earnings: { type: Number, default: 0 },
    },
    { timestamps: true }
);

ProviderServiceSchema.virtual("id").get(function (this: IProviderService) {
    return this._id.toHexString();
});

ProviderServiceSchema.set("toJSON", { virtuals: true });

export interface IProviderService extends ProviderServiceType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const ProviderServiceModel = mongoose.model<IProviderService>(
    "ProviderService",
    ProviderServiceSchema
);
