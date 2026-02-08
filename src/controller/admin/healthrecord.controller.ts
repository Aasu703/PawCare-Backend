import { Request, Response } from "express";
import { HealthRecordService } from "../../services/healthrecord.service";

const healthRecordService = new HealthRecordService();

export class AdminHealthRecordController {
    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await healthRecordService.getAllHealthRecords(page, limit);
            return res.json({ success: true, data: result });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const record = await healthRecordService.getHealthRecordById(req.params.id);
            return res.json({ success: true, data: record });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            await healthRecordService.deleteHealthRecord(req.params.id, userId, "admin");
            return res.json({ success: true, message: "Health record deleted" });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }
}

export default new AdminHealthRecordController();
