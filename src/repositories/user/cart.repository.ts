import { CartModel, ICart } from "../../models/user/cart.model";
import { UpdateCartDtoType } from "../../dtos/user/cart.dto";
import { InventoryModel } from "../../models/provider/inventory.model";

export class CartRepository {
    async getCartByUserId(userId: string): Promise<ICart | null> {
        return CartModel.findOne({ userId }).exec();
    }

    async createOrUpdateCart(userId: string, updates: UpdateCartDtoType): Promise<ICart> {
        return CartModel.findOneAndUpdate(
            { userId },
            { $set: { items: updates.items || [] } },
            { new: true, upsert: true }
        ).exec() as Promise<ICart>;
    }

    async clearCart(userId: string): Promise<ICart | null> {
        return CartModel.findOneAndUpdate({ userId }, { $set: { items: [] } }, { new: true }).exec();
    }

    async addItemToCart(userId: string, itemData: { productId: string; quantity: number }): Promise<ICart> {
        const inventory = await InventoryModel.findById(itemData.productId);
        if (!inventory) throw new Error("Product not found");

        let cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            cart = new CartModel({
                userId,
                items: [{
                    productId: inventory._id.toString(),
                    productName: inventory.product_name,
                    quantity: itemData.quantity,
                    price: inventory.price || 0,
                    providerId: (inventory.providerId as any)?.toString?.() || inventory.providerId
                }]
            });
        } else {
            const existingItemIndex = cart.items!.findIndex(
                item => item.productId.toString() === itemData.productId
            );
            
            if (existingItemIndex > -1) {
                cart.items![existingItemIndex].quantity += itemData.quantity;
            } else {
                cart.items!.push({
                    productId: inventory._id.toString(),
                    productName: inventory.product_name,
                    quantity: itemData.quantity,
                    price: inventory.price || 0,
                    providerId: (inventory.providerId as any)?.toString?.() || inventory.providerId
                });
            }
        }
        
        return await cart.save();
    }

    async updateCartItem(userId: string, itemId: string, quantity: number): Promise<ICart | null> {
        return CartModel.findOneAndUpdate(
            { userId, "items._id": itemId },
            { $set: { "items.$.quantity": quantity } },
            { new: true }
        ).exec();
    }

    async removeCartItem(userId: string, itemId: string): Promise<ICart | null> {
        return CartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        ).exec();
    }
}

export default new CartRepository();
