import { Request, Response } from "express";
import { InventoryService } from "../../services/inventory.service";
import { CreateInventoryDto, UpdateInventoryDto } from "../../dtos/inventory.dto";
import z from "zod";

const inventoryService = new InventoryService();

export class ProviderInventoryController {
    async create(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            // Provider creates inventory scoped to their provider
            const parsed = CreateInventoryDto.safeParse({ ...req.body, providerId: req.body.providerId });
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const item = await inventoryService.createInventory(parsed.data);
            return res.status(201).json({ success: true, message: "Inventory item created", data: item });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getByProviderId(req: Request, res: Response) {
        try {
            const items = await inventoryService.getInventoryByProviderId(req.params.providerId);
            return res.status(200).json({ success: true, data: items });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const item = await inventoryService.getInventoryById(req.params.id);
            return res.status(200).json({ success: true, data: item });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const parsed = UpdateInventoryDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const item = await inventoryService.updateInventory(req.params.id, parsed.data);
            return res.status(200).json({ success: true, message: "Inventory item updated", data: item });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            await inventoryService.deleteInventory(req.params.id);
            return res.status(200).json({ success: true, message: "Inventory item deleted" });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default new ProviderInventoryController();
