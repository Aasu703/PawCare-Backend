import mongoose, {Document, Schema} from "mongoose";
import { BookingType } from "../types/booking.type";

const BookingSchema: Schema = new Schema<BookingType>(
    {
        startTime: {type: String, required: true},
        endTime: {type: String, required: true},
        status: {type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending"},
        price: {type: Number, min: 0, required: false},
        notes: {type: String, required: false},
        serviceId: {type: String, required: false},
        userId: {type: String, required: false},
        petId: {type: String, required: false}
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

export interface IBooking extends BookingType, Document {
    id: string;
    _id: mongoose.Types.ObjectId;
}

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
// BookingModel will be used to interact with the bookings collection in MongoDB
// It provides methods to create, read, update, and delete booking documents
