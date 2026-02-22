import { CartRepository } from "../../../../repositories/user/cart.repository";
import { CartModel } from "../../../../models/user/cart.model";
import { InventoryModel } from "../../../../models/provider/inventory.model";
import { UpdateCartDtoType } from "../../../../dtos/user/cart.dto";

jest.mock("../../../../models/user/cart.model");
jest.mock("../../../../models/provider/inventory.model");

describe("CartRepository", () => {
    let cartRepository: CartRepository;
    let mockCartModel: jest.Mocked<typeof CartModel>;
    let mockInventoryModel: jest.Mocked<typeof InventoryModel>;

    beforeEach(() => {
        cartRepository = new CartRepository();
        mockCartModel = CartModel as jest.Mocked<typeof CartModel>;
        mockInventoryModel = InventoryModel as jest.Mocked<typeof InventoryModel>;
        jest.clearAllMocks();
    });

    describe("getCartByUserId", () => {
        it("should return cart when found", async () => {
            const mockCart = {
                _id: "cartId123",
                userId: "userId123",
                items: []
            };

            const mockExec = jest.fn().mockResolvedValue(mockCart);
            mockCartModel.findOne = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await cartRepository.getCartByUserId("userId123");

            expect(mockCartModel.findOne).toHaveBeenCalledWith({ userId: "userId123" });
            expect(result).toEqual(mockCart);
        });

        it("should return null when cart not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockCartModel.findOne = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await cartRepository.getCartByUserId("userId123");

            expect(result).toBeNull();
        });
    });

    describe("createOrUpdateCart", () => {
        it("should create or update cart successfully", async () => {
            const updates: UpdateCartDtoType = {
                items: [
                    {
                        productId: "prod123",
                        productName: "Product 1",
                        quantity: 2,
                        price: 10.99,
                        providerId: "provider123"
                    }
                ]
            };

            const mockCart = {
                _id: "cartId123",
                userId: "userId123",
                items: updates.items
            };

            const mockExec = jest.fn().mockResolvedValue(mockCart);
            mockCartModel.findOneAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await cartRepository.createOrUpdateCart("userId123", updates);

            expect(mockCartModel.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: "userId123" },
                { $set: { items: updates.items } },
                { new: true, upsert: true }
            );
            expect(result).toEqual(mockCart);
        });
    });

    describe("clearCart", () => {
        it("should clear cart items", async () => {
            const mockCart = {
                _id: "cartId123",
                userId: "userId123",
                items: []
            };

            const mockExec = jest.fn().mockResolvedValue(mockCart);
            mockCartModel.findOneAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await cartRepository.clearCart("userId123");

            expect(mockCartModel.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: "userId123" },
                { $set: { items: [] } },
                { new: true }
            );
            expect(result).toEqual(mockCart);
        });
    });

    describe("addItemToCart", () => {
        it("should add item to new cart", async () => {
            const itemData = {
                productId: "prod123",
                quantity: 2
            };

            const mockInventory = {
                _id: "prod123",
                product_name: "Product 1",
                price: 10.99,
                providerId: "provider123"
            };

            const mockCart = {
                userId: "userId123",
                items: [{
                    productId: "prod123",
                    productName: "Product 1",
                    quantity: 2,
                    price: 10.99,
                    providerId: "provider123"
                }],
                save: jest.fn().mockResolvedValue({
                    _id: "cartId123",
                    userId: "userId123",
                    items: [{
                        productId: "prod123",
                        productName: "Product 1",
                        quantity: 2,
                        price: 10.99,
                        providerId: "provider123"
                    }]
                })
            };

            mockInventoryModel.findById = jest.fn().mockResolvedValue(mockInventory);
            mockCartModel.findOne = jest.fn().mockResolvedValue(null);
            (mockCartModel as any).mockImplementation(() => mockCart);

            const result = await cartRepository.addItemToCart("userId123", itemData);

            expect(mockInventoryModel.findById).toHaveBeenCalledWith("prod123");
            expect(mockCartModel.findOne).toHaveBeenCalledWith({ userId: "userId123" });
            expect(mockCart.save).toHaveBeenCalled();
        });

        it("should add item to existing cart", async () => {
            const itemData = {
                productId: "prod123",
                quantity: 2
            };

            const mockInventory = {
                _id: "prod123",
                product_name: "Product 1",
                price: 10.99,
                providerId: "provider123"
            };

            const mockCart = {
                _id: "cartId123",
                userId: "userId123",
                items: [],
                save: jest.fn().mockResolvedValue({
                    _id: "cartId123",
                    userId: "userId123",
                    items: [{
                        productId: "prod123",
                        productName: "Product 1",
                        quantity: 2,
                        price: 10.99,
                        providerId: "provider123"
                    }]
                })
            };

            mockInventoryModel.findById = jest.fn().mockResolvedValue(mockInventory);
            mockCartModel.findOne = jest.fn().mockResolvedValue(mockCart);

            const result = await cartRepository.addItemToCart("userId123", itemData);

            expect(mockCart.save).toHaveBeenCalled();
        });

        it("should throw error if product not found", async () => {
            mockInventoryModel.findById = jest.fn().mockResolvedValue(null);

            await expect(
                cartRepository.addItemToCart("userId123", { productId: "invalid", quantity: 1 })
            ).rejects.toThrow("Product not found");
        });
    });

    describe("updateCartItem", () => {
        it("should update cart item quantity", async () => {
            const mockCart = {
                _id: "cartId123",
                userId: "userId123",
                items: [{ _id: "item123", quantity: 5 }]
            };

            const mockExec = jest.fn().mockResolvedValue(mockCart);
            mockCartModel.findOneAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await cartRepository.updateCartItem("userId123", "item123", 5);

            expect(mockCartModel.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: "userId123", "items._id": "item123" },
                { $set: { "items.$.quantity": 5 } },
                { new: true }
            );
            expect(result).toEqual(mockCart);
        });
    });

    describe("removeCartItem", () => {
        it("should remove item from cart", async () => {
            const mockCart = {
                _id: "cartId123",
                userId: "userId123",
                items: []
            };

            const mockExec = jest.fn().mockResolvedValue(mockCart);
            mockCartModel.findOneAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await cartRepository.removeCartItem("userId123", "item123");

            expect(mockCartModel.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: "userId123" },
                { $pull: { items: { _id: "item123" } } },
                { new: true }
            );
            expect(result).toEqual(mockCart);
        });
    });
});
