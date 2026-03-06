import { OrderRepository } from "../../repositories/user/order.repository";
import { InventoryModel } from "../../models/provider/inventory.model";
import { OrderModel } from "../../models/user/order.model";
import { HttpError } from "../../errors/http-error";
import mongoose from "mongoose";

const VALID_TRANSITIONS: Record<string, string> = {
    pending: "processing",
    processing: "shipped",
    shipped: "delivered",
};

export class ProviderOrderService {
    constructor(private orderRepository = new OrderRepository()) {}

    async getOrdersByProvider(providerId: string) {
        // Find all product IDs belonging to this provider
        const products = await InventoryModel.find({ providerId }).select("_id").lean().exec();
        const productIds = products.map((p) => new mongoose.Types.ObjectId(p._id.toString()));

        if (productIds.length === 0) return { orders: [] };

        // Find orders that contain at least one product from this provider
        const orders = await OrderModel.find({ "items.productId": { $in: productIds } } as any)
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return { orders };
    }

    async getOrderById(orderId: string, providerId: string) {
        const order = await OrderModel.findById(orderId)
            .populate("userId", "name email")
            .lean()
            .exec();
        if (!order) throw new HttpError(404, "Order not found");

        // Verify this order contains at least one product from this provider
        const products = await InventoryModel.find({ providerId }).select("_id").lean().exec();
        const productIdSet = new Set(products.map((p) => p._id.toString()));

        const hasProviderProduct = order.items.some((item: any) =>
            productIdSet.has(item.productId?.toString())
        );
        if (!hasProviderProduct) throw new HttpError(403, "This order does not contain your products");

        return order;
    }

    async updateOrderStatus(orderId: string, providerId: string, newStatus: string) {
        // First verify provider owns a product in this order
        const order = await this.getOrderById(orderId, providerId);

        const currentStatus = order.status;

        if (currentStatus === "cancelled") {
            throw new HttpError(400, "Cannot update a cancelled order");
        }

        const expectedNext = VALID_TRANSITIONS[currentStatus as string];
        if (!expectedNext || expectedNext !== newStatus) {
            throw new HttpError(
                400,
                `Invalid status transition: cannot go from "${currentStatus}" to "${newStatus}"`
            );
        }

        const updated = await OrderModel.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true }
        )
            .populate("userId", "name email")
            .exec();

        if (!updated) throw new HttpError(404, "Order not found");
        return updated;
    }
}
