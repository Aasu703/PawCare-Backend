import mongoose, { Document, Schema } from "mongoose";
import { ServiceType } from "../types/service.type";

const ServiceSchema: Schema = new Schema<ServiceType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    duration_minutes: { type: Number, required: true },
    catergory: { type: String },
    availability: { type: [String], required: false },
    providerId: { type: String, required: false },
  },
  { timestamps: true }
);

ServiceSchema.virtual("id").get(function (this: IService) {
  return this._id.toHexString();
});

ServiceSchema.set("toJSON", { virtuals: true });

export interface IService extends ServiceType, Document {
  id: string;
  _id: mongoose.Types.ObjectId;
}

export const ServiceModel = mongoose.model<IService>("Service", ServiceSchema);
