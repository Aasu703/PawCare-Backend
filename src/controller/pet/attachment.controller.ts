import { Request, Response } from "express";
import { AttachmentService } from "../../services/attachment.service";
import { CreateAttachmentDto, UpdateAttachmentDto } from "../../dtos/attachment.dto";
import z from "zod";

const attachmentService = new AttachmentService();

export class AttachmentController {
    async create(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = CreateAttachmentDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const attachment = await attachmentService.createAttachment(parsed.data);
            return res.status(201).json({ success: true, message: "Attachment created", data: attachment });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getByHealthRecordId(req: Request, res: Response) {
        try {
            const attachments = await attachmentService.getAttachmentsByHealthRecordId(req.params.healthRecordId);
            return res.status(200).json({ success: true, data: attachments });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const attachment = await attachmentService.getAttachmentById(req.params.id);
            return res.status(200).json({ success: true, data: attachment });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const parsed = UpdateAttachmentDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const attachment = await attachmentService.updateAttachment(req.params.id, parsed.data);
            return res.status(200).json({ success: true, message: "Attachment updated", data: attachment });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            await attachmentService.deleteAttachment(req.params.id);
            return res.status(200).json({ success: true, message: "Attachment deleted" });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default new AttachmentController();
