import { Request, Response } from "express";
import { HttpError } from "../../errors/http-error";
import petAdvisorService from "../../services/chat/pet-advisor.service";

class PetAdvisorController {
    private resolveUserId(req: Request): string {
        const requestUser = (req.user as Record<string, unknown> | undefined) ?? {};
        const rawId = requestUser._id ?? requestUser.id;
        const userId = rawId ? rawId.toString() : "";

        if (!userId) {
            throw new HttpError(401, "Unauthorized");
        }

        return userId;
    }

    async chat(req: Request, res: Response) {
        try {
            const userId = this.resolveUserId(req);
            const { message } = req.body;

            if (!message || typeof message !== "string" || message.trim().length === 0) {
                throw new HttpError(400, "Message is required and must be a non-empty string");
            }

            const response = await petAdvisorService.getResponse(userId, message.trim());

            return res.status(200).json({
                success: true,
                message: "Response generated",
                data: {
                    userMessage: message,
                    advisorResponse: response,
                    timestamp: new Date(),
                },
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal server error",
            });
        }
    }

    async getHistory(req: Request, res: Response) {
        try {
            const userId = this.resolveUserId(req);
            const history = await petAdvisorService.getConversationHistory(userId);

            return res.status(200).json({
                success: true,
                message: "Conversation history retrieved",
                data: history,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal server error",
            });
        }
    }

    async clearHistory(req: Request, res: Response) {
        try {
            const userId = this.resolveUserId(req);
            await petAdvisorService.clearHistory(userId);

            return res.status(200).json({
                success: true,
                message: "Conversation history cleared",
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal server error",
            });
        }
    }
}

export default new PetAdvisorController();
