import mongoose, {Document, Schema} from "mongoose";
import { ProviderType } from "../types/provider.type";

const ProviderSchema: Schema = new Schema(
    {
        businessName: {type: String, required: true},
        address: {type: String, required: true},
        phone: {type: String},
            userId: { type: String, required: false },
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        rating: {type: Number, default: 0},

    },
    {
        timestamps: true,
    }
);

export interface IProvider extends ProviderType, Document { //extends Document to include mongoose document properties
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    createdAt?: string;
    updatedAt?: string;
}

export const ProviderModel = mongoose.model<IProvider>("Provider", ProviderSchema);
// ProviderModel will be used to interact with the providers collection in MongoDB
// It provides methods to create, read, update, and delete provider documents