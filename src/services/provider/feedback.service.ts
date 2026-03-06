import { CreateFeedbackDto, UpdateFeedbackDto } from "../../dtos/provider/feedback.dto";
import { HttpError } from "../../errors/http-error";
import { FeedbackRepository } from "../../repositories/provider/feedback.repository";
import { BookingRepository } from "../../repositories/user/booking.repository";

const resolveId = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value?._id) return resolveId(value._id);
    if (value?.id) return resolveId(value.id);
    if (typeof value?.toHexString === "function") return value.toHexString();
    if (typeof value?.toString === "function") {
        const stringified = value.toString();
        return stringified === "[object Object]" ? "" : stringified;
    }
    return "";
};

export class FeedbackService {
    constructor(
        private feedbackRepository = new FeedbackRepository(),
        private bookingRepository = new BookingRepository()
    ) {}

    async createFeedback(data: CreateFeedbackDto, providerId: string) {
        if (!providerId) {
            throw new HttpError(400, "Provider ID is required");
        }
        if (!data.userId) {
            throw new HttpError(400, "Target user ID is required");
        }

        if (data.bookingId) {
            const booking = await this.bookingRepository.getBookingById(data.bookingId);
            if (!booking) {
                throw new HttpError(404, "Booking not found");
            }

            const bookingProviderId = resolveId((booking as any).providerId);
            const bookingUserId = resolveId((booking as any).userId);

            if (!bookingProviderId || bookingProviderId !== providerId.toString()) {
                throw new HttpError(403, "Forbidden: not your booking");
            }
            if (!bookingUserId || bookingUserId !== data.userId.toString()) {
                throw new HttpError(400, "Selected user does not match booking");
            }
            if ((booking as any).status !== "completed") {
                throw new HttpError(400, "Booking must be completed before leaving feedback");
            }

            const existing = await this.feedbackRepository.getFeedbackByProviderAndBooking(providerId, data.bookingId);
            if (existing) {
                throw new HttpError(409, "Feedback already submitted for this booking");
            }
        }

        return this.feedbackRepository.createFeedback({ ...data, providerId }, providerId);
    }

    async getFeedbackById(id: string) {
        const feedback = await this.feedbackRepository.getFeedbackById(id);
        if (!feedback) {
            throw new HttpError(404, "Feedback not found");
        }
        return feedback;
    }

    async getFeedbackByProviderId(providerId: string) {
        return this.feedbackRepository.getFeedbackByProviderId(providerId);
    }

    async getAllFeedback(page: number = 1, limit: number = 10) {
        return this.feedbackRepository.getAllFeedback(page, limit);
    }

    async updateFeedback(id: string, providerId: string, data: UpdateFeedbackDto, role?: string) {
        const existing = await this.feedbackRepository.getFeedbackById(id);
        if (!existing) {
            throw new HttpError(404, "Feedback not found");
        }
        if (role !== "admin" && resolveId((existing as any).providerId) !== providerId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const updated = await this.feedbackRepository.updateFeedbackById(id, data);
        if (!updated) {
            throw new HttpError(404, "Feedback not found");
        }
        return updated;
    }

    async deleteFeedback(id: string, providerId: string, role?: string) {
        const existing = await this.feedbackRepository.getFeedbackById(id);
        if (!existing) {
            throw new HttpError(404, "Feedback not found");
        }
        if (role !== "admin" && resolveId((existing as any).providerId) !== providerId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const deleted = await this.feedbackRepository.deleteFeedbackById(id);
        if (!deleted) {
            throw new HttpError(404, "Feedback not found");
        }
        return deleted;
    }
}
