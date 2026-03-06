import { Request, Response } from "express";
import { ProviderOrderService } from "../../services/provider/order.service";
import z from "zod";

const providerOrderService = new ProviderOrderService();

const UpdateStatusDto = z.object({
    status: z.enum(["processing", "shipped", "delivered"]),
});

export class ProviderOrderController {
    async listMyOrders(req: Request, res: Response) {
        try {
            const providerId = (req as any).provider?._id?.toString();
            if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const result = await providerOrderService.getOrdersByProvider(providerId);
            return res.status(200).json({ success: true, data: result });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const providerId = (req as any).provider?._id?.toString();
            if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const order = await providerOrderService.getOrderById(req.params.id, providerId);
            return res.status(200).json({ success: true, data: order });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const providerId = (req as any).provider?._id?.toString();
            if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = UpdateStatusDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }

            const updated = await providerOrderService.updateOrderStatus(req.params.id, providerId, parsed.data.status);
            return res.status(200).json({ success: true, message: "Order status updated", data: updated });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }
}

export default new ProviderOrderController();
