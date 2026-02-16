import z from "zod";
import { CartItemSchema } from "../../types/user/cart.type";

export const UpdateCartDto = z.object({
    items: z.array(CartItemSchema).optional(),
});

export type UpdateCartDtoType = z.infer<typeof UpdateCartDto>;
