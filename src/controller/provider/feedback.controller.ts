import { Request, Response } from "express";
import { FeedbackService } from "../../services/feedback.service";
import { CreateFeedbackDto, UpdateFeedbackDto } from "../../dtos/feedback.dto";
import z from "zod";

const feedbackService = new FeedbackService();

export class FeedbackController {
    async create(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = CreateFeedbackDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const feedback = await feedbackService.createFeedback(parsed.data, userId);
            return res.status(201).json({ success: true, message: "Feedback created", data: feedback });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getByProviderId(req: Request, res: Response) {
        try {
            const feedback = await feedbackService.getFeedbackByProviderId(req.params.providerId);
            return res.status(200).json({ success: true, data: feedback });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const feedback = await feedbackService.getFeedbackById(req.params.id);
            return res.status(200).json({ success: true, data: feedback });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = UpdateFeedbackDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const feedback = await feedbackService.updateFeedback(req.params.id, userId, parsed.data, role);
            return res.status(200).json({ success: true, message: "Feedback updated", data: feedback });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            await feedbackService.deleteFeedback(req.params.id, userId, role);
            return res.status(200).json({ success: true, message: "Feedback deleted" });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default new FeedbackController();
