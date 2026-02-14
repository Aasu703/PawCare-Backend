import { Request, Response } from "express";
import { ReviewService } from "../../services/user/review.service";
import { CreateReviewDto, UpdateReviewDto } from "../../dtos/user/review.dto";
import z from "zod";

const reviewService = new ReviewService();

export class ReviewController {
    async create(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = CreateReviewDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const review = await reviewService.createReview(parsed.data, userId);
            return res.status(201).json({ success: true, message: "Review created", data: review });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getMyReviews(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const reviews = await reviewService.getReviewsByUserId(userId);
            return res.status(200).json({ success: true, data: reviews });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const review = await reviewService.getReviewById(req.params.id);
            return res.status(200).json({ success: true, data: review });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = UpdateReviewDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const review = await reviewService.updateReview(req.params.id, userId, parsed.data, role);
            return res.status(200).json({ success: true, message: "Review updated", data: review });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            await reviewService.deleteReview(req.params.id, userId, role);
            return res.status(200).json({ success: true, message: "Review deleted" });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getByProvider(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await reviewService.getReviewsByProviderId(req.params.providerId, page, limit);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getByProduct(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await reviewService.getReviewsByProductId(req.params.productId, page, limit);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getProviderRating(req: Request, res: Response) {
        try {
            const avgRating = await reviewService.getAverageRatingByProviderId(req.params.providerId);
            return res.status(200).json({ success: true, data: { averageRating: avgRating } });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default new ReviewController();
