import { BookingModel, IBooking } from "../../models/user/booking.model";
import { CreateBookingDto, UpdateBookingDto } from "../../dtos/user/booking.dto";

export class BookingRepository {
    async createBooking(data: CreateBookingDto, userId: string): Promise<IBooking> {
        const booking = await BookingModel.create({
            startTime: data.startTime,
            endTime: data.endTime,
            serviceId: data.serviceId,
            petId: data.petId,
            notes: data.notes,
            userId: userId
        });
        return booking;
    }

    async getBookingById(id: string): Promise<IBooking | null> {
        return BookingModel.findById(id).exec();
    }
    async getAllBookings(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const bookings = await BookingModel.find().skip(skip).limit(limit);
        const total = await BookingModel.countDocuments();
        return {
            bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async updateBookingById(id: string, updates: UpdateBookingDto): Promise<IBooking | null> {
        return BookingModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }
    async deleteBookingById(id: string): Promise<IBooking | null> {
        return BookingModel.findByIdAndDelete(id).exec();
    }
    async getBookingsByUserId(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const bookings = await BookingModel.find({ userId }).sort({ startTime: -1 }).skip(skip).limit(limit).exec();
        return bookings;
    }

    async countBookingsByUserId(userId: string) {
        return BookingModel.countDocuments({ userId }).exec();
    }
    
}