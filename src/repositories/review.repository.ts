import { ReviewModel, IReview } from "../models/review.model";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/user/review.dto";

export class ReviewRepository {
    async createReview(data: CreateReviewDto, userId: string): Promise<IReview> {
        return ReviewModel.create({ ...data, userId });
    }

    async getReviewById(id: string): Promise<IReview | null> {
        return ReviewModel.findById(id).exec();
    }

    async getAllReviews(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            ReviewModel.find().skip(skip).limit(limit).exec(),
            ReviewModel.countDocuments().exec()
        ]);
        return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getReviewsByUserId(userId: string): Promise<IReview[]> {
        return ReviewModel.find({ userId }).exec();
    }

    async updateReviewById(id: string, updates: UpdateReviewDto): Promise<IReview | null> {
        return ReviewModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteReviewById(id: string): Promise<IReview | null> {
        return ReviewModel.findByIdAndDelete(id).exec();
    }
}
