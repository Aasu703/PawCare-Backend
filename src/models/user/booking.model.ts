import mongoose, {Document, Schema} from "mongoose";
import { BookingType } from "../../types/user/booking.type";

const BookingSchema: Schema = new Schema(
    {
        startTime: {type: String, required: true},
        endTime: {type: String, required: true},
        status: {type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending"},
        price: {type: Number, min: 0, required: false},
        notes: {type: String, required: false},
        serviceId: {type: mongoose.Schema.Types.ObjectId, ref: "Service", required: false, index: true},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true},
        petId: {type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: false, index: true},
        providerId: {type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: false, index: true},
        providerServiceId: {type: mongoose.Schema.Types.ObjectId, ref: "ProviderService", required: false, index: true}
    },
    {
        timestamps: true,
    }
);

BookingSchema.virtual('id').get(function(this: IBooking) {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised
BookingSchema.set('toJSON', {
    virtuals: true,
});

BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ providerId: 1, createdAt: -1 });
BookingSchema.index({ status: 1, startTime: 1 });

export interface IBooking extends BookingType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
// BookingModel will be used to interact with the bookings collection in MongoDB
// It provides methods to create, read, update, and delete booking documents
