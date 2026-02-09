import { Request, Response } from "express";
import { FeedbackService } from "../../services/provider/feedback.service";

const feedbackService = new FeedbackService();

export class AdminFeedbackController {
    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await feedbackService.getAllFeedback(page, limit);
            return res.json({ success: true, data: result });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const feedback = await feedbackService.getFeedbackById(req.params.id);
            return res.json({ success: true, data: feedback });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async getByProviderId(req: Request, res: Response) {
        try {
            const feedback = await feedbackService.getFeedbackByProviderId(req.params.providerId);
            return res.json({ success: true, data: feedback });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            await feedbackService.deleteFeedback(req.params.id, userId, "admin");
            return res.json({ success: true, message: "Feedback deleted" });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }
}

export default new AdminFeedbackController();
