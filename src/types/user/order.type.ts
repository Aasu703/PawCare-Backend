import z from "zod";

export const OrderItemSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.coerce.number().int().positive(),
    price: z.coerce.number().nonnegative(),
});

export type OrderItemType = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    items: z.array(OrderItemSchema).min(1),
    totalAmount: z.coerce.number().nonnegative(),
    status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).default("pending"),
    shippingAddress: z.string().optional(),
    notes: z.string().optional(),
    createdAt: z.string().optional(),
});

export type OrderType = z.infer<typeof OrderSchema>;
