import { InventoryRepository } from "../../../../repositories/provider/inventory.repository";
import { InventoryModel } from "../../../../models/provider/inventory.model";
import { CreateInventoryDto, UpdateInventoryDto } from "../../../../dtos/provider/inventory.dto";

jest.mock("../../../../models/provider/inventory.model");

describe("InventoryRepository", () => {
    let inventoryRepository: InventoryRepository;
    let mockInventoryModel: jest.Mocked<typeof InventoryModel>;

    beforeEach(() => {
        inventoryRepository = new InventoryRepository();
        mockInventoryModel = InventoryModel as jest.Mocked<typeof InventoryModel>;
        jest.clearAllMocks();
    });

    describe("createInventory", () => {
        it("should create a new inventory item successfully", async () => {
            const createInventoryDto: CreateInventoryDto = {
                product_name: "Dog Food",
                price: 29.99,
                quantity: 100,
                providerId: "provider123"
            };

            const mockInventory = {
                _id: "inventoryId123",
                ...createInventoryDto
            };

            mockInventoryModel.create = jest.fn().mockResolvedValue(mockInventory);

            const result = await inventoryRepository.createInventory(createInventoryDto);

            expect(mockInventoryModel.create).toHaveBeenCalledWith(createInventoryDto);
            expect(result).toEqual(mockInventory);
        });
    });

    describe("getInventoryById", () => {
        it("should return inventory item when found", async () => {
            const mockInventory = {
                _id: "inventoryId123",
                product_name: "Dog Food",
                price: 29.99
            };

            const mockExec = jest.fn().mockResolvedValue(mockInventory);
            mockInventoryModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await inventoryRepository.getInventoryById("inventoryId123");

            expect(mockInventoryModel.findById).toHaveBeenCalledWith("inventoryId123");
            expect(result).toEqual(mockInventory);
        });

        it("should return null when inventory not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockInventoryModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await inventoryRepository.getInventoryById("invalidId");

            expect(result).toBeNull();
        });
    });

    describe("getInventoryByProviderId", () => {
        it("should return all inventory items for a provider", async () => {
            const mockInventory = [
                { _id: "inv1", product_name: "Dog Food", providerId: "provider123" },
                { _id: "inv2", product_name: "Cat Toy", providerId: "provider123" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockInventory);
            mockInventoryModel.find = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await inventoryRepository.getInventoryByProviderId("provider123");

            expect(mockInventoryModel.find).toHaveBeenCalledWith({ providerId: "provider123" });
            expect(result).toEqual(mockInventory);
        });
    });

    describe("getAllInventory", () => {
        it("should return paginated inventory items", async () => {
            const mockItems = [
                { _id: "inv1", product_name: "Product 1" },
                { _id: "inv2", product_name: "Product 2" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockItems);
            const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
            mockInventoryModel.find = jest.fn().mockReturnValue({ sort: mockSort });

            const mockCountExec = jest.fn().mockResolvedValue(25);
            mockInventoryModel.countDocuments = jest.fn().mockReturnValue({ exec: mockCountExec });

            const result = await inventoryRepository.getAllInventory(2, 10);

            expect(mockInventoryModel.find).toHaveBeenCalled();
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1, _id: -1 });
            expect(mockSkip).toHaveBeenCalledWith(10);
            expect(mockLimit).toHaveBeenCalledWith(10);
            expect(result).toEqual({
                items: mockItems,
                total: 25,
                page: 2,
                limit: 10,
                totalPages: 3
            });
        });
    });

    describe("updateInventoryById", () => {
        it("should update inventory item successfully", async () => {
            const updates: UpdateInventoryDto = {
                price: 34.99,
                quantity: 150
            };

            const mockUpdatedInventory = {
                _id: "inventoryId123",
                product_name: "Dog Food",
                ...updates
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedInventory);
            mockInventoryModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await inventoryRepository.updateInventoryById("inventoryId123", updates);

            expect(mockInventoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "inventoryId123",
                updates,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedInventory);
        });
    });

    describe("deleteInventoryById", () => {
        it("should delete inventory item successfully", async () => {
            const mockDeletedInventory = {
                _id: "inventoryId123",
                product_name: "Dog Food"
            };

            const mockExec = jest.fn().mockResolvedValue(mockDeletedInventory);
            mockInventoryModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await inventoryRepository.deleteInventoryById("inventoryId123");

            expect(mockInventoryModel.findByIdAndDelete).toHaveBeenCalledWith("inventoryId123");
            expect(result).toEqual(mockDeletedInventory);
        });
    });
});
