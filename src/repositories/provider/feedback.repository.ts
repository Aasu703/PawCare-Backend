import { FeedbackModel, IFeedback } from "../../models/provider/feedback.model";
import { CreateFeedbackDto, UpdateFeedbackDto } from "../../dtos/provider/feedback.dto";

export class FeedbackRepository {
    async createFeedback(data: CreateFeedbackDto, providerId: string): Promise<IFeedback> {
        return FeedbackModel.create({ ...data, providerId });
    }

    async getFeedbackByProviderAndBooking(providerId: string, bookingId: string): Promise<IFeedback | null> {
        return FeedbackModel.findOne({ providerId, bookingId }).exec();
    }

    async getFeedbackById(id: string): Promise<IFeedback | null> {
        return FeedbackModel.findById(id)
            .populate("userId", "Firstname Lastname email")
            .populate("providerId", "businessName email")
            .populate("bookingId", "startTime endTime status")
            .exec();
    }

    async getFeedbackByProviderId(providerId: string): Promise<IFeedback[]> {
        return FeedbackModel.find({ providerId })
            .populate("userId", "Firstname Lastname email")
            .populate("bookingId", "startTime endTime status")
            .sort({ createdAt: -1 })
            .exec();
    }

    async getAllFeedback(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [feedback, total] = await Promise.all([
            FeedbackModel.find()
                .populate("providerId", "businessName email")
                .populate("userId", "Firstname Lastname email")
                .populate("bookingId", "startTime endTime status")
                .skip(skip)
                .limit(limit)
                .exec(),
            FeedbackModel.countDocuments().exec()
        ]);
        return { feedback, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async updateFeedbackById(id: string, updates: UpdateFeedbackDto): Promise<IFeedback | null> {
        return FeedbackModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteFeedbackById(id: string): Promise<IFeedback | null> {
        return FeedbackModel.findByIdAndDelete(id).exec();
    }
}
