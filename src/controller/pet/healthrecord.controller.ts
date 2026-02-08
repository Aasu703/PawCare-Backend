import { Request, Response } from "express";
import { HealthRecordService } from "../../services/healthrecord.service";
import { CreateHealthRecordDto, UpdateHealthRecordDto } from "../../dtos/healthrecord.dto";
import z from "zod";

const healthRecordService = new HealthRecordService();

export class HealthRecordController {
    async create(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = CreateHealthRecordDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const record = await healthRecordService.createHealthRecord(parsed.data, userId, role);
            return res.status(201).json({ success: true, message: "Health record created", data: record });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getByPetId(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const records = await healthRecordService.getHealthRecordsByPetId(req.params.petId, userId, role);
            return res.status(200).json({ success: true, data: records });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const record = await healthRecordService.getHealthRecordById(req.params.id);
            return res.status(200).json({ success: true, data: record });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = UpdateHealthRecordDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const record = await healthRecordService.updateHealthRecord(req.params.id, userId, parsed.data, role);
            return res.status(200).json({ success: true, message: "Health record updated", data: record });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const role = req.user?.role;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            await healthRecordService.deleteHealthRecord(req.params.id, userId, role);
            return res.status(200).json({ success: true, message: "Health record deleted" });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default new HealthRecordController();
