import z from "zod";
import { OrderSchema, OrderItemSchema } from "../../types/user/order.type";

export const CreateOrderDto = z.object({
    items: z.array(OrderItemSchema).min(1),
    totalAmount: z.coerce.number().nonnegative(),
    shippingAddress: z.string().optional(),
    notes: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderDto>;

export const UpdateOrderDto = z.object({
    status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
    shippingAddress: z.string().optional(),
    notes: z.string().optional(),
});

export type UpdateOrderDto = z.infer<typeof UpdateOrderDto>;
