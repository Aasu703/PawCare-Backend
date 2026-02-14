import z from "zod";
import { ReviewSchema } from "../../types/user/review.type";

export const CreateReviewDto = ReviewSchema.pick({
    rating: true,
    comment: true,
    providerId: true,
    providerServiceId: true,
    productId: true,
    bookingId: true,
    reviewType: true
});

export type CreateReviewDto = z.infer<typeof CreateReviewDto>;

export const UpdateReviewDto = ReviewSchema.partial().omit({ id: true, userId: true });
export type UpdateReviewDto = z.infer<typeof UpdateReviewDto>;
