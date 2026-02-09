import z from "zod";

export const InventorySchema = z.object({
    id: z.string().optional(),
    product_name: z.string().min(1),
    description: z.string().optional(),
    price: z.coerce.number().nonnegative().optional(),
    quantity: z.coerce.number().int().nonnegative().optional(),
    category: z.string().optional(),
    providerId: z.string().optional()
})

export type InventoryType = z.infer<typeof InventorySchema>;    