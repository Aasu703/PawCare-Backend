import { Request, Response } from "express";
import { FeedbackService } from "../../services/provider/feedback.service";
import { CreateFeedbackDto, UpdateFeedbackDto } from "../../dtos/provider/feedback.dto";
import z from "zod";

const feedbackService = new FeedbackService();

export class FeedbackController {
    async create(req: Request, res: Response) {
        try {
            const providerId = req.user?._id;
            if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = CreateFeedbackDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const feedback = await feedbackService.createFeedback(parsed.data, providerId.toString());
            return res.status(201).json({ success: true, message: "Feedback created", data: feedback });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getByProviderId(req: Request, res: Response) {
        try {
            const providerId = req.user?._id?.toString();
            if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const feedback = await feedbackService.getFeedbackByProviderId(providerId);
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
            const providerId = req.user?._id;
            const role = req.user?.role;
            if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = UpdateFeedbackDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const feedback = await feedbackService.updateFeedback(req.params.id, providerId.toString(), parsed.data, role);
            return res.status(200).json({ success: true, message: "Feedback updated", data: feedback });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const providerId = req.user?._id;
            const role = req.user?.role;
            if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized" });

            await feedbackService.deleteFeedback(req.params.id, providerId.toString(), role);
            return res.status(200).json({ success: true, message: "Feedback deleted" });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default new FeedbackController();
