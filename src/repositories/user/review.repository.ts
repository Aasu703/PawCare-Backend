import { ReviewModel, IReview } from "../../models/user/review.model";
import { CreateReviewDto, UpdateReviewDto } from "../../dtos/user/review.dto";
import mongoose from "mongoose";

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

    async getEnrichedReviewsByProviderId(providerId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const UserModel = mongoose.model("User");
        const [reviews, total] = await Promise.all([
            ReviewModel.find({ providerId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
            ReviewModel.countDocuments({ providerId }).exec()
        ]);

        const userIds = reviews
            .map((r: any) => r.userId)
            .filter((id: any) => id && mongoose.Types.ObjectId.isValid(id));
        const users = userIds.length > 0
            ? await UserModel.find({ _id: { $in: userIds } }).select("firstName lastName profileImage").lean().exec()
            : [];
        const userMap = new Map((users as any[]).map((u: any) => [u._id.toString(), u]));

        const enriched = reviews.map((review: any) => {
            const user = userMap.get(review.userId?.toString());
            return {
                ...review,
                id: review._id?.toString(),
                userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Anonymous',
                userProfileImage: (user as any)?.profileImage || '',
            };
        });

        return { reviews: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getRatingBreakdownByProviderId(providerId: string) {
        const result = await ReviewModel.aggregate([
            { $match: { providerId } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                    five: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                    four: { $sum: { $cond: [{ $and: [{ $gte: ["$rating", 4] }, { $lt: ["$rating", 5] }] }, 1, 0] } },
                    three: { $sum: { $cond: [{ $and: [{ $gte: ["$rating", 3] }, { $lt: ["$rating", 4] }] }, 1, 0] } },
                    two: { $sum: { $cond: [{ $and: [{ $gte: ["$rating", 2] }, { $lt: ["$rating", 3] }] }, 1, 0] } },
                    one: { $sum: { $cond: [{ $lt: ["$rating", 2] }, 1, 0] } },
                }
            }
        ]);
        if (result.length === 0) {
            return { averageRating: 0, totalReviews: 0, breakdown: { excellent: 0, good: 0, average: 0, belowAverage: 0, poor: 0 } };
        }
        const r = result[0];
        return {
            averageRating: Math.round(r.avgRating * 10) / 10,
            totalReviews: r.totalReviews,
            breakdown: {
                excellent: r.five,
                good: r.four,
                average: r.three,
                belowAverage: r.two,
                poor: r.one,
            }
        };
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
