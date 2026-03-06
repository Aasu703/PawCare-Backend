import { CreateReviewDto, UpdateReviewDto } from "../../dtos/user/review.dto";
import { HttpError } from "../../errors/http-error";
import { ReviewRepository } from "../../repositories/user/review.repository";
import { BookingRepository } from "../../repositories/user/booking.repository";
import ProviderServiceService from "../provider/provider-service.service";

export class ReviewService {
    constructor(
        private reviewRepository = new ReviewRepository(),
        private bookingRepository = new BookingRepository(),
        private providerServiceService = new ProviderServiceService()
    ) {}

    async createReview(data: CreateReviewDto, userId: string) {
        if (!userId) {
            throw new HttpError(400, "User ID is required");
        }
        if (data.bookingId) {
            const booking = await this.bookingRepository.getBookingById(data.bookingId);
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
            const providerService = await this.providerServiceService.getProviderServiceById(data.providerServiceId);
            if (providerService.verificationStatus !== "approved") {
                throw new HttpError(403, "Provider service is not approved");
            }
        }
        const review = await this.reviewRepository.createReview(data, userId);
        if (data.providerServiceId) {
            await this.providerServiceService.updateRatingForService(data.providerServiceId, data.rating);
        }
        return review;
    }

    async getReviewById(id: string) {
        const review = await this.reviewRepository.getReviewById(id);
        if (!review) {
            throw new HttpError(404, "Review not found");
        }
        return review;
    }

    async getAllReviews(page: number = 1, limit: number = 10) {
        return this.reviewRepository.getAllReviews(page, limit);
    }

    async getReviewsByUserId(userId: string) {
        return this.reviewRepository.getReviewsByUserId(userId);
    }

    async updateReview(id: string, userId: string, data: UpdateReviewDto, role?: string) {
        const existing = await this.reviewRepository.getReviewById(id);
        if (!existing) {
            throw new HttpError(404, "Review not found");
        }
        if (role !== "admin" && existing.userId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const updated = await this.reviewRepository.updateReviewById(id, data);
        if (!updated) {
            throw new HttpError(404, "Review not found");
        }
        return updated;
    }

    async deleteReview(id: string, userId: string, role?: string) {
        const existing = await this.reviewRepository.getReviewById(id);
        if (!existing) {
            throw new HttpError(404, "Review not found");
        }
        if (role !== "admin" && existing.userId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const deleted = await this.reviewRepository.deleteReviewById(id);
        if (!deleted) {
            throw new HttpError(404, "Review not found");
        }
        return deleted;
    }

    async getReviewsByProviderId(providerId: string, page: number = 1, limit: number = 10) {
        return this.reviewRepository.getReviewsByProviderId(providerId, page, limit);
    }

    async getEnrichedReviewsByProviderId(providerId: string, page: number = 1, limit: number = 10) {
        return this.reviewRepository.getEnrichedReviewsByProviderId(providerId, page, limit);
    }

    async getRatingBreakdownByProviderId(providerId: string) {
        return this.reviewRepository.getRatingBreakdownByProviderId(providerId);
    }

    async getReviewsByProductId(productId: string, page: number = 1, limit: number = 10) {
        return this.reviewRepository.getReviewsByProductId(productId, page, limit);
    }

    async getAverageRatingByProviderId(providerId: string) {
        return this.reviewRepository.getAverageRatingByProviderId(providerId);
    }
}
