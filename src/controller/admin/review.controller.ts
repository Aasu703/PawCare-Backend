import { Request, Response } from "express";
import { ReviewService } from "../../services/review.service";

const reviewService = new ReviewService();

export class AdminReviewController {
    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await reviewService.getAllReviews(page, limit);
            return res.json({ success: true, data: result });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const review = await reviewService.getReviewById(req.params.id);
            return res.json({ success: true, data: review });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            await reviewService.deleteReview(req.params.id, userId, "admin");
            return res.json({ success: true, message: "Review deleted" });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }
}

export default new AdminReviewController();
