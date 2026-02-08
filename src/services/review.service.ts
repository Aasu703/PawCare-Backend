import { CreateReviewDto, UpdateReviewDto } from "../dtos/user/review.dto";
import { HttpError } from "../errors/http-error";
import { ReviewRepository } from "../repositories/review.repository";

const reviewRepository = new ReviewRepository();

export class ReviewService {
    async createReview(data: CreateReviewDto, userId: string) {
        if (!userId) {
            throw new HttpError(400, "User ID is required");
        }
        return reviewRepository.createReview(data, userId);
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
}
