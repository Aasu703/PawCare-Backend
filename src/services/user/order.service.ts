import { CreateOrderDto, UpdateOrderDto } from "../../dtos/user/order.dto";
import { OrderRepository } from "../../repositories/user/order.repository";
import { InventoryRepository } from "../../repositories/provider/inventory.repository";
import { HttpError } from "../../errors/http-error";

export class OrderService {
    constructor(
        private orderRepository = new OrderRepository(),
        private inventoryRepository = new InventoryRepository()
    ) {}

    async createOrder(data: CreateOrderDto, userId: string) {
        // Validate stock for each item and decrement
        for (const item of data.items) {
            const product = await this.inventoryRepository.getInventoryById(item.productId);
            if (!product) {
                throw new HttpError(404, `Product not found: ${item.productName}`);
            }
            if ((product.quantity ?? 0) < item.quantity) {
                throw new HttpError(400, `Insufficient stock for ${item.productName}. Available: ${product.quantity}`);
            }
        }

        // Decrement stock
        for (const item of data.items) {
            const product = await this.inventoryRepository.getInventoryById(item.productId);
            if (product) {
                await this.inventoryRepository.updateInventoryById(item.productId, {
                    quantity: (product.quantity ?? 0) - item.quantity,
                });
            }
        }

        return this.orderRepository.createOrder(data, userId);
    }

    async getOrderById(id: string) {
        const order = await this.orderRepository.getOrderById(id);
        if (!order) throw new HttpError(404, "Order not found");
        return order;
    }

    async getOrdersByUserId(userId: string, page = 1, limit = 10) {
        return this.orderRepository.getOrdersByUserId(userId, page, limit);
    }

    async getAllOrders(page = 1, limit = 10) {
        return this.orderRepository.getAllOrders(page, limit);
    }

    async updateOrder(id: string, data: UpdateOrderDto) {
        const order = await this.orderRepository.updateOrderById(id, data);
        if (!order) throw new HttpError(404, "Order not found");
        return order;
    }

    async deleteOrder(id: string) {
        const order = await this.orderRepository.deleteOrderById(id);
        if (!order) throw new HttpError(404, "Order not found");
        return order;
    }
}
