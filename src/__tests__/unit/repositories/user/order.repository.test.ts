import { OrderRepository } from "../../../../repositories/user/order.repository";
import { OrderModel } from "../../../../models/user/order.model";
import { CreateOrderDto, UpdateOrderDto } from "../../../../dtos/user/order.dto";

jest.mock("../../../../models/user/order.model");

describe("OrderRepository", () => {
    let orderRepository: OrderRepository;
    let mockOrderModel: jest.Mocked<typeof OrderModel>;

    beforeEach(() => {
        orderRepository = new OrderRepository();
        mockOrderModel = OrderModel as jest.Mocked<typeof OrderModel>;
        jest.clearAllMocks();
    });

    describe("createOrder", () => {
        it("should create a new order successfully", async () => {
            const createOrderDto: CreateOrderDto = {
                items: [
                    {
                        productId: "prod123",
                        productName: "Product 1",
                        quantity: 2,
                        price: 10.99
                    }
                ],
                totalAmount: 21.98,
                shippingAddress: "123 Main St, City, State 12345"
            };

            const mockOrder = {
                _id: "orderId123",
                ...createOrderDto,
                userId: "userId123"
            };

            mockOrderModel.create = jest.fn().mockResolvedValue(mockOrder);

            const result = await orderRepository.createOrder(createOrderDto, "userId123");

            expect(mockOrderModel.create).toHaveBeenCalledWith({
                ...createOrderDto,
                userId: "userId123"
            });
            expect(result).toEqual(mockOrder);
        });
    });

    describe("getOrderById", () => {
        it("should return order when found", async () => {
            const mockOrder = {
                _id: "orderId123",
                userId: "userId123",
                totalAmount: 99.99
            };

            const mockExec = jest.fn().mockResolvedValue(mockOrder);
            mockOrderModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await orderRepository.getOrderById("orderId123");

            expect(mockOrderModel.findById).toHaveBeenCalledWith("orderId123");
            expect(result).toEqual(mockOrder);
        });

        it("should return null when order not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockOrderModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await orderRepository.getOrderById("invalidId");

            expect(result).toBeNull();
        });
    });

    describe("getOrdersByUserId", () => {
        it("should return paginated orders for user", async () => {
            const mockOrders = [
                { _id: "order1", userId: "userId123" },
                { _id: "order2", userId: "userId123" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockOrders);
            const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
            mockOrderModel.find = jest.fn().mockReturnValue({ sort: mockSort });

            const mockCountExec = jest.fn().mockResolvedValue(15);
            mockOrderModel.countDocuments = jest.fn().mockReturnValue({ exec: mockCountExec });

            const result = await orderRepository.getOrdersByUserId("userId123", 2, 5);

            expect(mockOrderModel.find).toHaveBeenCalledWith({ userId: "userId123" });
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockSkip).toHaveBeenCalledWith(5); // (2 - 1) * 5
            expect(mockLimit).toHaveBeenCalledWith(5);
            expect(result).toEqual({
                items: mockOrders,
                total: 15,
                page: 2,
                limit: 5,
                totalPages: 3
            });
        });
    });

    describe("getAllOrders", () => {
        it("should return all orders with pagination", async () => {
            const mockOrders = [
                { _id: "order1" },
                { _id: "order2" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockOrders);
            const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
            mockOrderModel.find = jest.fn().mockReturnValue({ sort: mockSort });

            const mockCountExec = jest.fn().mockResolvedValue(25);
            mockOrderModel.countDocuments = jest.fn().mockReturnValue({ exec: mockCountExec });

            const result = await orderRepository.getAllOrders(1, 10);

            expect(mockOrderModel.find).toHaveBeenCalledWith();
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(result.totalPages).toBe(3);
        });
    });

    describe("updateOrderById", () => {
        it("should update order successfully", async () => {
            const updates: UpdateOrderDto = {
                status: "shipped"
            };

            const mockUpdatedOrder = {
                _id: "orderId123",
                status: "shipped"
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedOrder);
            mockOrderModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await orderRepository.updateOrderById("orderId123", updates);

            expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "orderId123",
                updates,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedOrder);
        });
    });

    describe("deleteOrderById", () => {
        it("should delete order successfully", async () => {
            const mockDeletedOrder = {
                _id: "orderId123"
            };

            const mockExec = jest.fn().mockResolvedValue(mockDeletedOrder);
            mockOrderModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await orderRepository.deleteOrderById("orderId123");

            expect(mockOrderModel.findByIdAndDelete).toHaveBeenCalledWith("orderId123");
            expect(result).toEqual(mockDeletedOrder);
        });
    });
});
