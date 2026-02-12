import { Request, Response } from "express";
import { InventoryService } from "../../services/provider/inventory.service";
import { HttpError } from "../../errors/http-error";
import z from "zod";

const inventoryService = new InventoryService();

const PaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
});

const formatZodError = (error: z.ZodError) =>
    error.issues.map((issue) => issue.message).join(", ");

class PublicInventoryController {
    async list(req: Request, res: Response) {
        try {
            const parsed = PaginationSchema.safeParse({
                page: req.query.page,
                limit: req.query.limit
            });
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: formatZodError(parsed.error) });
            }
            const result = await inventoryService.getAllInventory(parsed.data.page, parsed.data.limit);
            return res.json({ success: true, data: result });
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ success: false, message: formatZodError(error) });
            }
            if (error instanceof HttpError) {
                return res.status(error.statusCode || 400).json({ success: false, message: error.message });
            }
            const err = error as Error;
            return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const item = await inventoryService.getInventoryById(req.params.id);
            return res.json({ success: true, data: item });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                return res.status(error.statusCode || 400).json({ success: false, message: error.message });
            }
            const err = error as Error;
            return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async listByProvider(req: Request, res: Response) {
        try {
            const items = await inventoryService.getInventoryByProviderId(req.params.providerId);
            return res.json({ success: true, data: items });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                return res.status(error.statusCode || 400).json({ success: false, message: error.message });
            }
            const err = error as Error;
            return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }
}

export default new PublicInventoryController();
