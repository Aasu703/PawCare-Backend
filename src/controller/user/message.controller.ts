import { Request, Response } from "express";
import { MessageService } from "../../services/user/message.service";
import { CreateMessageDto, UpdateMessageDto } from "../../dtos/user/message.dto";
import z from "zod";

const messageService = new MessageService();

export class MessageController {
    async create(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = CreateMessageDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const message = await messageService.createMessage(parsed.data, userId);
            return res.status(201).json({ success: true, message: "Message created", data: message });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getMyMessages(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const messages = await messageService.getMessagesByUserId(userId);
            return res.status(200).json({ success: true, data: messages });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const message = await messageService.getMessageById(req.params.id);
            return res.status(200).json({ success: true, data: message });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = UpdateMessageDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const message = await messageService.updateMessage(req.params.id, userId, parsed.data, role);
            return res.status(200).json({ success: true, message: "Message updated", data: message });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            await messageService.deleteMessage(req.params.id, userId, role);
            return res.status(200).json({ success: true, message: "Message deleted" });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default new MessageController();
