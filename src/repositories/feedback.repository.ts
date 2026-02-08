import { FeedbackModel, IFeedback } from "../models/feedback.model";
import { CreateFeedbackDto, UpdateFeedbackDto } from "../dtos/feedback.dto";

export class FeedbackRepository {
    async createFeedback(data: CreateFeedbackDto, userId: string): Promise<IFeedback> {
        return FeedbackModel.create({ ...data, userId });
    }

    async getFeedbackById(id: string): Promise<IFeedback | null> {
        return FeedbackModel.findById(id).exec();
    }

    async getFeedbackByProviderId(providerId: string): Promise<IFeedback[]> {
        return FeedbackModel.find({ providerId }).sort({ createdAt: -1 }).exec();
    }

    async getAllFeedback(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [feedback, total] = await Promise.all([
            FeedbackModel.find().skip(skip).limit(limit).exec(),
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
