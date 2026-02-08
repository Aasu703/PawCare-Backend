import { CreateFeedbackDto, UpdateFeedbackDto } from "../dtos/feedback.dto";
import { HttpError } from "../errors/http-error";
import { FeedbackRepository } from "../repositories/feedback.repository";

const feedbackRepository = new FeedbackRepository();

export class FeedbackService {
    async createFeedback(data: CreateFeedbackDto, userId: string) {
        if (!userId) {
            throw new HttpError(400, "User ID is required");
        }
        if (!data.providerId) {
            throw new HttpError(400, "Provider ID is required");
        }
        return feedbackRepository.createFeedback(data, userId);
    }

    async getFeedbackById(id: string) {
        const feedback = await feedbackRepository.getFeedbackById(id);
        if (!feedback) {
            throw new HttpError(404, "Feedback not found");
        }
        return feedback;
    }

    async getFeedbackByProviderId(providerId: string) {
        return feedbackRepository.getFeedbackByProviderId(providerId);
    }

    async getAllFeedback(page: number = 1, limit: number = 10) {
        return feedbackRepository.getAllFeedback(page, limit);
    }

    async updateFeedback(id: string, userId: string, data: UpdateFeedbackDto, role?: string) {
        const existing = await feedbackRepository.getFeedbackById(id);
        if (!existing) {
            throw new HttpError(404, "Feedback not found");
        }
        if (role !== "admin" && existing.userId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const updated = await feedbackRepository.updateFeedbackById(id, data);
        if (!updated) {
            throw new HttpError(404, "Feedback not found");
        }
        return updated;
    }

    async deleteFeedback(id: string, userId: string, role?: string) {
        const existing = await feedbackRepository.getFeedbackById(id);
        if (!existing) {
            throw new HttpError(404, "Feedback not found");
        }
        if (role !== "admin" && existing.userId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const deleted = await feedbackRepository.deleteFeedbackById(id);
        if (!deleted) {
            throw new HttpError(404, "Feedback not found");
        }
        return deleted;
    }
}
