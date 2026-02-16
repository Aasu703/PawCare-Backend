import { CreateBookingDto, UpdateBookingDto } from "../../dtos/user/booking.dto";
import { BookingRepository } from "../../repositories/user/booking.repository";
import { HttpError } from "../../errors/http-error";
import ProviderServiceService from "../provider/provider-service.service";
import ServiceRepository from "../../repositories/provider/service.repository";

let bookingRepository = new BookingRepository();
const providerServiceService = new ProviderServiceService();
const serviceRepository = new ServiceRepository();

export class BookingService {
    async createBooking(data: CreateBookingDto, userId: string){
        if (data.providerServiceId) {
            const providerService = await providerServiceService.getProviderServiceById(data.providerServiceId);
            if (providerService.verificationStatus !== "approved") {
                throw new HttpError(403, "Provider service is not approved");
            }
            if (providerService.serviceType === "shop_owner") {
                throw new HttpError(400, "shop_owner service is not valid for bookings");
            }
            if (!data.serviceId) {
                throw new HttpError(400, "serviceId is required when providerServiceId is provided");
            }
            const service = await serviceRepository.getServiceById(data.serviceId);
            if (!service) {
                throw new HttpError(404, "Service not found");
            }
            const serviceCategory = (service as any).catergory;
            const typeToCategory: Record<string, string> = {
                vet: "vet",
                groomer: "grooming",
                boarding: "boarding",
            };
            const expectedCategory = typeToCategory[providerService.serviceType];
            if (serviceCategory && expectedCategory && serviceCategory !== expectedCategory) {
                throw new HttpError(400, "Service type mismatch");
            }
        }
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
        // Pass the page number to the repository (it computes skip internally).
        const bookings = await bookingRepository.getBookingsByUserId(userId, page, limit);
        const total = await bookingRepository.countBookingsByUserId(userId);
        return {
            bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getBookingsByProviderId(providerId: string, page: number = 1, limit: number = 10) {
        return bookingRepository.getBookingsByProviderId(providerId, page, limit);
    }

    async updateBookingStatus(bookingId: string, providerId: string, status: string) {
        const booking = await bookingRepository.getBookingById(bookingId);
        if (!booking) {
            throw new HttpError(404, "Booking not found");
        }
        if (booking.providerId?.toString() !== providerId.toString()) {
            throw new HttpError(403, "Forbidden: not your booking");
        }
        const validStatuses = ["confirmed", "cancelled", "completed", "pending", "rejected"];
        if (!validStatuses.includes(status)) {
            throw new HttpError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
        }
        const updated = await bookingRepository.updateBookingById(bookingId, { status } as any);
        if (!updated) {
            throw new HttpError(404, "Booking not found");
        }
        return updated;
    }
}