import { ProviderRepository } from "../../../../repositories/provider/provider.repository";
import { ProviderModel } from "../../../../models/provider/provider.model";
import { CreateProviderDTO } from "../../../../dtos/provider/provider.dto";

jest.mock("../../../../models/provider/provider.model");

describe("ProviderRepository", () => {
    let providerRepository: ProviderRepository;
    let mockProviderModel: jest.Mocked<typeof ProviderModel>;

    beforeEach(() => {
        providerRepository = new ProviderRepository();
        mockProviderModel = ProviderModel as jest.Mocked<typeof ProviderModel>;
        jest.clearAllMocks();
    });

    describe("createProvider", () => {
        it("should create a new provider successfully", async () => {
            const createProviderDTO: CreateProviderDTO = {
                businessName: "Happy Pets Clinic",
                address: "123 Main St",
                phone: "555-1234",
                email: "clinic@example.com",
                password: "hashedPassword",
                confirmPassword: "hashedPassword"
            };

            const mockProvider = {
                _id: "providerId123",
                ...createProviderDTO,
                status: "pending",
                pawcareVerified: false,
                locationVerified: false
            };

            mockProviderModel.create = jest.fn().mockResolvedValue(mockProvider);

            const result = await providerRepository.createProvider(createProviderDTO);

            expect(mockProviderModel.create).toHaveBeenCalledWith({
                businessName: createProviderDTO.businessName,
                address: createProviderDTO.address,
                phone: createProviderDTO.phone,
                email: createProviderDTO.email,
                password: createProviderDTO.password,
                providerType: null,
                location: undefined,
                locationUpdatedAt: null,
                locationVerified: false,
                pawcareVerified: false,
                status: "pending"
            });
            expect(result).toEqual(mockProvider);
        });
    });

    describe("getProviderByEmail", () => {
        it("should return provider when found", async () => {
            const mockProvider = {
                _id: "providerId123",
                email: "clinic@example.com",
                businessName: "Happy Pets"
            };

            const mockExec = jest.fn().mockResolvedValue(mockProvider);
            mockProviderModel.findOne = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await providerRepository.getProviderByEmail("clinic@example.com");

            expect(mockProviderModel.findOne).toHaveBeenCalledWith({ email: "clinic@example.com" });
            expect(result).toEqual(mockProvider);
        });

        it("should return null when provider not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockProviderModel.findOne = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await providerRepository.getProviderByEmail("nonexistent@example.com");

            expect(result).toBeNull();
        });
    });

    describe("getProviderById", () => {
        it("should return provider when found by id", async () => {
            const mockProvider = {
                _id: "providerId123",
                businessName: "Happy Pets"
            };

            const mockExec = jest.fn().mockResolvedValue(mockProvider);
            mockProviderModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await providerRepository.getProviderById("providerId123");

            expect(mockProviderModel.findById).toHaveBeenCalledWith("providerId123");
            expect(result).toEqual(mockProvider);
        });
    });

    describe("updateProviderById", () => {
        it("should update provider successfully", async () => {
            const updates = {
                businessName: "Updated Clinic Name",
                phone: "555-9999"
            };

            const mockUpdatedProvider = {
                _id: "providerId123",
                ...updates
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedProvider);
            mockProviderModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await providerRepository.updateProviderById("providerId123", updates);

            expect(mockProviderModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "providerId123",
                updates,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedProvider);
        });
    });

    describe("deleteProviderById", () => {
        it("should delete provider successfully", async () => {
            const mockDeletedProvider = {
                _id: "providerId123",
                businessName: "Happy Pets"
            };

            const mockExec = jest.fn().mockResolvedValue(mockDeletedProvider);
            mockProviderModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await providerRepository.deleteProviderById("providerId123");

            expect(mockProviderModel.findByIdAndDelete).toHaveBeenCalledWith("providerId123");
            expect(result).toEqual(mockDeletedProvider);
        });
    });

    describe("getAllProviders", () => {
        it("should return all providers", async () => {
            const mockProviders = [
                { _id: "prov1", businessName: "Clinic 1" },
                { _id: "prov2", businessName: "Clinic 2" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockProviders);
            mockProviderModel.find = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await providerRepository.getAllProviders();

            expect(mockProviderModel.find).toHaveBeenCalled();
            expect(result).toEqual(mockProviders);
        });
    });

    describe("getProviderByUserId", () => {
        it("should return provider for a specific user", async () => {
            const mockProvider = {
                _id: "providerId123",
                userId: "userId123"
            };

            const mockExec = jest.fn().mockResolvedValue(mockProvider);
            mockProviderModel.findOne = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await providerRepository.getProviderByUserId("userId123");

            expect(mockProviderModel.findOne).toHaveBeenCalledWith({ userId: "userId123" });
            expect(result).toEqual(mockProvider);
        });
    });

    describe("getProvidersByType", () => {
        it("should return providers by type", async () => {
            const mockProviders = [
                { _id: "prov1", providerType: "vet", status: "approved" },
                { _id: "prov2", providerType: "vet", status: "approved" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockProviders);
            mockProviderModel.find = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await providerRepository.getProvidersByType("vet");

            expect(mockProviderModel.find).toHaveBeenCalledWith({ 
                providerType: "vet",
                status: "approved"
            });
            expect(result).toEqual(mockProviders);
        });
    });

    describe("getProvidersByStatus", () => {
        it("should return providers by status", async () => {
            const mockProviders = [
                { _id: "prov1", status: "pending" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockProviders);
            mockProviderModel.find = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await providerRepository.getProvidersByStatus("pending");

            expect(mockProviderModel.find).toHaveBeenCalledWith({ status: "pending" });
            expect(result).toEqual(mockProviders);
        });
    });

    describe("getVerifiedProvidersWithLocation", () => {
        it("should return verified providers with location", async () => {
            const mockProviders = [
                {
                    _id: "prov1",
                    businessName: "Verified Clinic",
                    providerType: "vet",
                    locationVerified: true,
                    pawcareVerified: true,
                    location: { latitude: 40.7128, longitude: -74.0060 }
                }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockProviders);
            const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
            const mockSelect = jest.fn().mockReturnValue({ sort: mockSort });
            mockProviderModel.find = jest.fn().mockReturnValue({ select: mockSelect });

            const result = await providerRepository.getVerifiedProvidersWithLocation();

            expect(mockProviderModel.find).toHaveBeenCalledWith({
                status: "approved",
                pawcareVerified: true,
                locationVerified: true,
                "location.latitude": { $exists: true },
                "location.longitude": { $exists: true }
            });
            expect(result).toEqual(mockProviders);
        });

        it("should filter by providerType when specified", async () => {
            const mockProviders: any[] = [];

            const mockExec = jest.fn().mockResolvedValue(mockProviders);
            const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
            const mockSelect = jest.fn().mockReturnValue({ sort: mockSort });
            mockProviderModel.find = jest.fn().mockReturnValue({ select: mockSelect });

            await providerRepository.getVerifiedProvidersWithLocation("shop");

            expect(mockProviderModel.find).toHaveBeenCalledWith({
                status: "approved",
                pawcareVerified: true,
                locationVerified: true,
                "location.latitude": { $exists: true },
                "location.longitude": { $exists: true },
                providerType: "shop"
            });
        });
    });
});
