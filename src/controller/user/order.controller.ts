import { Request, Response, NextFunction } from "express";
import { OrderService } from "../../services/user/order.service";
import { CreateOrderDto, UpdateOrderDto } from "../../dtos/user/order.dto";
import z from "zod";

const orderService = new OrderService();

export class OrderController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.id || (req as any).user?._id?.toString();
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = CreateOrderDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }

            const order = await orderService.createOrder(parsed.data, userId);
            return res.status(201).json({ success: true, message: "Order placed", data: order });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await orderService.getOrderById(req.params.id);
            return res.status(200).json({ success: true, data: order });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async getByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId || (req as any).user?.id || (req as any).user?._id?.toString();
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await orderService.getOrdersByUserId(userId, page, limit);
            return res.status(200).json({ success: true, ...result });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await orderService.getAllOrders(page, limit);
            return res.status(200).json({ success: true, ...result });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = UpdateOrderDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }
            const order = await orderService.updateOrder(req.params.id, parsed.data);
            return res.status(200).json({ success: true, message: "Order updated", data: order });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await orderService.deleteOrder(req.params.id);
            return res.status(200).json({ success: true, message: "Order deleted" });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }
}

export default new OrderController();
