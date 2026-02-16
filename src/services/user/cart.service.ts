import cartRepository from "../../repositories/user/cart.repository";
import { UpdateCartDtoType } from "../../dtos/user/cart.dto";
import { ICart } from "../../models/user/cart.model";

export class CartService {
    async getCartByUserId(userId: string): Promise<ICart | null> {
        return cartRepository.getCartByUserId(userId);
    }

    async addItemToCart(userId: string, itemData: { productId: string; quantity: number }): Promise<ICart> {
        return cartRepository.addItemToCart(userId, itemData);
    }

    async updateCartItem(userId: string, itemId: string, quantity: number): Promise<ICart | null> {
        return cartRepository.updateCartItem(userId, itemId, quantity);
    }

    async removeCartItem(userId: string, itemId: string): Promise<ICart | null> {
        return cartRepository.removeCartItem(userId, itemId);
    }

    async updateCart(userId: string, cartData: UpdateCartDtoType): Promise<ICart> {
        return cartRepository.createOrUpdateCart(userId, cartData);
    }

    async clearCart(userId: string): Promise<ICart | null> {
        return cartRepository.clearCart(userId);
    }
}
export default new CartService();
