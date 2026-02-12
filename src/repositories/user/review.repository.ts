import { ReviewModel, IReview } from "../../models/user/review.model";
import { CreateReviewDto, UpdateReviewDto } from "../../dtos/user/review.dto";

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

    async getReviewsByProviderId(providerId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            ReviewModel.find({ providerId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            ReviewModel.countDocuments({ providerId }).exec()
        ]);
        return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getReviewsByProductId(productId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            ReviewModel.find({ productId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            ReviewModel.countDocuments({ productId }).exec()
        ]);
        return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getAverageRatingByProviderId(providerId: string): Promise<number> {
        const result = await ReviewModel.aggregate([
            { $match: { providerId } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        return result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
    }

    async getAverageRatingByProviderServiceId(providerServiceId: string): Promise<number> {
        const result = await ReviewModel.aggregate([
            { $match: { providerServiceId } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        return result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
    }
}
