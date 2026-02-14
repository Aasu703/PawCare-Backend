import { Request, Response } from "express";
import { InventoryService } from "../../services/provider/inventory.service";
import { CreateInventoryDto, UpdateInventoryDto } from "../../dtos/provider/inventory.dto";
import { HttpError } from "../../errors/http-error";
import z from "zod";

const inventoryService = new InventoryService();

const PaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
});

const formatZodError = (error: z.ZodError) =>
    error.issues.map((issue) => issue.message).join(", ");

export class ProviderInventoryController {
    async create(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            // Provider creates inventory scoped to their provider
            const parsed = CreateInventoryDto.safeParse({ ...req.body, providerId: req.body.providerId });
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: formatZodError(parsed.error) });
            }
            const item = await inventoryService.createInventory(parsed.data);
            return res.status(201).json({ success: true, message: "Inventory item created", data: item });
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

    async listPublic(req: Request, res: Response) {
        try {
            const parsed = PaginationSchema.safeParse({
                page: req.query.page,
                limit: req.query.limit
            });
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: formatZodError(parsed.error) });
            }
            const result = await inventoryService.getAllInventory(parsed.data.page, parsed.data.limit);
            return res.status(200).json({
                success: true,
                data: result.items,
                meta: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages
                }
            });
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

    async getByProviderId(req: Request, res: Response) {
        try {
            const items = await inventoryService.getInventoryByProviderId(req.params.providerId);
            return res.status(200).json({ success: true, data: items });
        } catch (error: unknown) {
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
            return res.status(200).json({ success: true, data: item });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                return res.status(error.statusCode || 400).json({ success: false, message: error.message });
            }
            const err = error as Error;
            return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const parsed = UpdateInventoryDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: formatZodError(parsed.error) });
            }
            const item = await inventoryService.updateInventory(req.params.id, parsed.data);
            return res.status(200).json({ success: true, message: "Inventory item updated", data: item });
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

    async remove(req: Request, res: Response) {
        try {
            await inventoryService.deleteInventory(req.params.id);
            return res.status(200).json({ success: true, message: "Inventory item deleted" });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                return res.status(error.statusCode || 400).json({ success: false, message: error.message });
            }
            const err = error as Error;
            return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }
}

export default new ProviderInventoryController();
