import z from "zod";
import { FeedbackSchema } from "../types/feedback.type";

export const CreateFeedbackDto = FeedbackSchema.pick({
    feedback: true,
    providerId: true
});

export type CreateFeedbackDto = z.infer<typeof CreateFeedbackDto>;

export const UpdateFeedbackDto = FeedbackSchema.partial().omit({ id: true, providerId: true, userId: true });
export type UpdateFeedbackDto = z.infer<typeof UpdateFeedbackDto>;
