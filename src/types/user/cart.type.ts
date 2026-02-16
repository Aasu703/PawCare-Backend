import z from "zod";

export const CartItemSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.coerce.number().int().min(0),
    price: z.coerce.number().nonnegative(),
    providerId: z.string().optional(),
});

export type CartItemType = z.infer<typeof CartItemSchema>;

export const CartSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    items: z.array(CartItemSchema).optional(),
    updatedAt: z.string().optional(),
});

export type CartType = z.infer<typeof CartSchema>;
