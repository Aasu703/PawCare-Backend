import z from "zod";
import { InventorySchema } from "../types/inventory.type";

export const CreateInventoryDto = InventorySchema.pick({
    product_name: true,
    description: true,
    price: true,
    quantity: true,
    category: true,
    providerId: true
});

export type CreateInventoryDto = z.infer<typeof CreateInventoryDto>;

export const UpdateInventoryDto = InventorySchema.partial().omit({ id: true, providerId: true });
export type UpdateInventoryDto = z.infer<typeof UpdateInventoryDto>;
