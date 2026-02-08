import { Request, Response } from "express";
import { MessageService } from "../../services/message.service";

const messageService = new MessageService();

export class AdminMessageController {
    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await messageService.getAllMessages(page, limit);
            return res.json({ success: true, data: result });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const message = await messageService.getMessageById(req.params.id);
            return res.json({ success: true, data: message });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            await messageService.deleteMessage(req.params.id, userId, "admin");
            return res.json({ success: true, message: "Message deleted" });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }
}

export default new AdminMessageController();
