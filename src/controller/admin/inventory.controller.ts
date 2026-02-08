import { Request, Response } from "express";
import { InventoryService } from "../../services/inventory.service";

const inventoryService = new InventoryService();

export class AdminInventoryController {
    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await inventoryService.getAllInventory(page, limit);
            return res.json({ success: true, data: result });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const item = await inventoryService.getInventoryById(req.params.id);
            return res.json({ success: true, data: item });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async getByProviderId(req: Request, res: Response) {
        try {
            const items = await inventoryService.getInventoryByProviderId(req.params.providerId);
            return res.json({ success: true, data: items });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            await inventoryService.deleteInventory(req.params.id);
            return res.json({ success: true, message: "Inventory item deleted" });
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message });
        }
    }
}

export default new AdminInventoryController();
