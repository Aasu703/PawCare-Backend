import { OrderModel, IOrder } from "../../models/user/order.model";
import { CreateOrderDto, UpdateOrderDto } from "../../dtos/user/order.dto";

export class OrderRepository {
    async createOrder(data: CreateOrderDto, userId: string): Promise<IOrder> {
        return OrderModel.create({ ...data, userId });
    }

    async getOrderById(id: string): Promise<IOrder | null> {
        return OrderModel.findById(id).exec();
    }

    async getOrdersByUserId(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            OrderModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            OrderModel.countDocuments({ userId }).exec(),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getAllOrders(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            OrderModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            OrderModel.countDocuments().exec(),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async updateOrderById(id: string, updates: UpdateOrderDto): Promise<IOrder | null> {
        return OrderModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteOrderById(id: string): Promise<IOrder | null> {
        return OrderModel.findByIdAndDelete(id).exec();
    }
}
