import { CreateBookingDto, UpdateBookingDto } from "../dtos/user/booking.dto";
import { BookingRepository } from "../repositories/booking.repository";
import { HttpError } from "../errors/http-error";

let bookingRepository = new BookingRepository();

export class BookingService {
    async createBooking(data: CreateBookingDto, userId: string){
        const newBooking = await bookingRepository.createBooking(data, userId);
        return newBooking;
    
    }

    async getBookingById(bookingId: string){
        const booking = await bookingRepository.getBookingById(bookingId);
        if(!booking){
            throw new HttpError(404, "Booking not found");
        }
        return booking;
    }

    async getAllBookings(page: number = 1, limit: number = 10){
        return bookingRepository.getAllBookings(page, limit);
    }

    async updateBooking(bookingId: string, updates: UpdateBookingDto){
        const updatedBooking = await bookingRepository.updateBookingById(bookingId, updates);
        if(!updatedBooking){
            throw new HttpError(404, "Booking not found");
        }
        return updatedBooking;
    }
    async deleteBooking(bookingId: string){
        const deletedBooking = await bookingRepository.deleteBookingById(bookingId);
        if(!deletedBooking){
            throw new HttpError(404, "Booking not found");
        }
        return deletedBooking;
    }
    async getBookingsByUserId(userId: string, page: number = 1, limit: number = 10){
        const skip = (page - 1) * limit;
        const bookings = await bookingRepository.getBookingsByUserId(userId, skip, limit);
        const total = await bookingRepository.countBookingsByUserId(userId);
        return {
            bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
}