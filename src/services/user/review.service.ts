import { CreateReviewDto, UpdateReviewDto } from "../../dtos/user/review.dto";
import { HttpError } from "../../errors/http-error";
import { ReviewRepository } from "../../repositories/user/review.repository";
import { BookingRepository } from "../../repositories/user/booking.repository";
import ProviderServiceService from "../provider/provider-service.service";

const reviewRepository = new ReviewRepository();
const bookingRepository = new BookingRepository();
const providerServiceService = new ProviderServiceService();

export class ReviewService {
    async createReview(data: CreateReviewDto, userId: string) {
        if (!userId) {
            throw new HttpError(400, "User ID is required");
        }
        if (data.bookingId) {
            const booking = await bookingRepository.getBookingById(data.bookingId);
            if (!booking) {
                throw new HttpError(404, "Booking not found");
            }
            if (booking.userId?.toString() !== userId.toString()) {
                throw new HttpError(403, "Forbidden: not your booking");
            }
            if (booking.status !== "completed") {
                throw new HttpError(400, "Booking must be completed before rating");
            }
            if (data.providerServiceId && booking.providerServiceId && booking.providerServiceId !== data.providerServiceId) {
                throw new HttpError(400, "Provider service does not match booking");
            }
        }
        if (data.providerServiceId) {
            if (!data.bookingId) {
                throw new HttpError(400, "bookingId is required when providerServiceId is provided");
            }
            const providerService = await providerServiceService.getProviderServiceById(data.providerServiceId);
            if (providerService.verificationStatus !== "approved") {
                throw new HttpError(403, "Provider service is not approved");
            }
        }
        const review = await reviewRepository.createReview(data, userId);
        if (data.providerServiceId) {
            await providerServiceService.updateRatingForService(data.providerServiceId, data.rating);
        }
        return review;
    }

    async getReviewById(id: string) {
        const review = await reviewRepository.getReviewById(id);
        if (!review) {
            throw new HttpError(404, "Review not found");
        }
        return review;
    }

    async getAllReviews(page: number = 1, limit: number = 10) {
        return reviewRepository.getAllReviews(page, limit);
    }

    async getReviewsByUserId(userId: string) {
        return reviewRepository.getReviewsByUserId(userId);
    }

    async updateReview(id: string, userId: string, data: UpdateReviewDto, role?: string) {
        const existing = await reviewRepository.getReviewById(id);
        if (!existing) {
            throw new HttpError(404, "Review not found");
        }
        if (role !== "admin" && existing.userId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const updated = await reviewRepository.updateReviewById(id, data);
        if (!updated) {
            throw new HttpError(404, "Review not found");
        }
        return updated;
    }

    async deleteReview(id: string, userId: string, role?: string) {
        const existing = await reviewRepository.getReviewById(id);
        if (!existing) {
            throw new HttpError(404, "Review not found");
        }
        if (role !== "admin" && existing.userId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const deleted = await reviewRepository.deleteReviewById(id);
        if (!deleted) {
            throw new HttpError(404, "Review not found");
        }
        return deleted;
    }

    async getReviewsByProviderId(providerId: string, page: number = 1, limit: number = 10) {
        return reviewRepository.getReviewsByProviderId(providerId, page, limit);
    }

    async getReviewsByProductId(productId: string, page: number = 1, limit: number = 10) {
        return reviewRepository.getReviewsByProductId(productId, page, limit);
    }

    async getAverageRatingByProviderId(providerId: string) {
        return reviewRepository.getAverageRatingByProviderId(providerId);
    }
}
