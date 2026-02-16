import mongoose, { Document, Schema } from "mongoose";
import { PetType } from "../../types/pet/pet.type";

const PetSchema: Schema = new Schema<PetType>(
    {
        name: { type: String, required: true },
        species: { type: String, required: true },
        breed: { type: String, required: false },
        age: { type: Number, required: false },
        weight: { type: Number, required: false },
        imageUrl: { type: String, required: false },
        allergies: { type: String, required: false },
        dietNotes: { type: String, required: false },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
        timestamps: true,
    }
);

PetSchema.index({ ownerId: 1, createdAt: -1 });
PetSchema.index({ species: 1 });

export interface IPet extends PetType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const PetModel = mongoose.model<IPet>("Pet", PetSchema);