import { CreateOrderDto, UpdateOrderDto } from "../../dtos/user/order.dto";
import { OrderRepository } from "../../repositories/user/order.repository";
import { InventoryRepository } from "../../repositories/provider/inventory.repository";
import { HttpError } from "../../errors/http-error";

const orderRepository = new OrderRepository();
const inventoryRepository = new InventoryRepository();

export class OrderService {
    async createOrder(data: CreateOrderDto, userId: string) {
        // Validate stock for each item and decrement
        for (const item of data.items) {
            const product = await inventoryRepository.getInventoryById(item.productId);
            if (!product) {
                throw new HttpError(404, `Product not found: ${item.productName}`);
            }
            if ((product.quantity ?? 0) < item.quantity) {
                throw new HttpError(400, `Insufficient stock for ${item.productName}. Available: ${product.quantity}`);
            }
        }

        // Decrement stock
        for (const item of data.items) {
            const product = await inventoryRepository.getInventoryById(item.productId);
            if (product) {
                await inventoryRepository.updateInventoryById(item.productId, {
                    quantity: (product.quantity ?? 0) - item.quantity,
                });
            }
        }

        return orderRepository.createOrder(data, userId);
    }

    async getOrderById(id: string) {
        const order = await orderRepository.getOrderById(id);
        if (!order) throw new HttpError(404, "Order not found");
        return order;
    }

    async getOrdersByUserId(userId: string, page = 1, limit = 10) {
        return orderRepository.getOrdersByUserId(userId, page, limit);
    }

    async getAllOrders(page = 1, limit = 10) {
        return orderRepository.getAllOrders(page, limit);
    }

    async updateOrder(id: string, data: UpdateOrderDto) {
        const order = await orderRepository.updateOrderById(id, data);
        if (!order) throw new HttpError(404, "Order not found");
        return order;
    }

    async deleteOrder(id: string) {
        const order = await orderRepository.deleteOrderById(id);
        if (!order) throw new HttpError(404, "Order not found");
        return order;
    }
}
