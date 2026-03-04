import { CreatePetDto, UpdatePetDto, UpdatePetCareDto } from "../../../../dtos/pet/pet.dto";
import { HttpError } from "../../../../errors/http-error";

// Mock the repository
const mockPetRepository = {
    createPet: jest.fn(),
    getPetById: jest.fn(),
    getPetsByOwnerId: jest.fn(),
    getAllPets: jest.fn(),
    updatePetById: jest.fn(),
    updatePetCareById: jest.fn(),
    deletePetById: jest.fn()
};

jest.mock("../../../../repositories/pet/pet.repository", () => ({
    PetRepository: jest.fn().mockImplementation(() => mockPetRepository)
}));

// Import after mocking
import { PetService } from "../../../../services/pet/pet.service";

describe("PetService", () => {
    let petService: PetService;

    beforeEach(() => {
        petService = new PetService();
        jest.clearAllMocks();
    });

    describe("createPet", () => {
        it("should create a new pet successfully", async () => {
            const ownerId = "owner123";
            const createPetDto: CreatePetDto = {
                name: "Buddy",
                species: "Dog",
                breed: "Golden Retriever",
                age: 3
            };

            const mockPet = {
                _id: "pet123",
                ...createPetDto,
                ownerId
            };

            mockPetRepository.createPet = jest.fn().mockResolvedValue(mockPet);

            const result = await petService.createPet(ownerId, createPetDto);

            expect(mockPetRepository.createPet).toHaveBeenCalledWith(ownerId, createPetDto);
            expect(result).toEqual(mockPet);
        });

        it("should throw error if ownerId not provided", async () => {
            const createPetDto: CreatePetDto = {
                name: "Buddy",
                species: "Dog",
                breed: "Golden Retriever",
                age: 3
            };

            await expect(petService.createPet("", createPetDto)).rejects.toThrow(HttpError);
            await expect(petService.createPet("", createPetDto)).rejects.toThrow("Owner ID is required");
        });
    });

    describe("getPetById", () => {
        it("should return pet when found and owner matches", async () => {
            const mockPet = {
                _id: "pet123",
                name: "Buddy",
                ownerId: "owner123"
            };

            mockPetRepository.getPetById = jest.fn().mockResolvedValue(mockPet);

            const result = await petService.getPetById("pet123", "owner123");

            expect(mockPetRepository.getPetById).toHaveBeenCalledWith("pet123");
            expect(result).toEqual(mockPet);
        });

        it("should throw error if petId not provided", async () => {
            await expect(petService.getPetById("", "owner123")).rejects.toThrow(HttpError);
            await expect(petService.getPetById("", "owner123")).rejects.toThrow("Pet ID is required");
        });

        it("should throw error if pet not found", async () => {
            mockPetRepository.getPetById = jest.fn().mockResolvedValue(null);

            await expect(petService.getPetById("pet123", "owner123")).rejects.toThrow(HttpError);
            await expect(petService.getPetById("pet123", "owner123")).rejects.toThrow("Pet not found");
        });

        it("should throw forbidden error if owner doesn't match and not admin", async () => {
            const mockPet = {
                _id: "pet123",
                name: "Buddy",
                ownerId: "owner123"
            };

            mockPetRepository.getPetById = jest.fn().mockResolvedValue(mockPet);

            await expect(petService.getPetById("pet123", "differentOwner")).rejects.toThrow(HttpError);
            await expect(petService.getPetById("pet123", "differentOwner")).rejects.toThrow("Forbidden");
        });

        it("should allow access if user is admin even if not the owner", async () => {
            const mockPet = {
                _id: "pet123",
                name: "Buddy",
                ownerId: "owner123"
            };

            mockPetRepository.getPetById = jest.fn().mockResolvedValue(mockPet);

            const result = await petService.getPetById("pet123", "differentOwner", "admin");

            expect(result).toEqual(mockPet);
        });
    });

    describe("getAllPetsForUser", () => {
        it("should return all pets for a specific owner", async () => {
            const mockPets = [
                { _id: "pet1", name: "Buddy", ownerId: "owner123" },
                { _id: "pet2", name: "Max", ownerId: "owner123" }
            ];

            mockPetRepository.getPetsByOwnerId = jest.fn().mockResolvedValue(mockPets);

            const result = await petService.getAllPetsForUser("owner123");

            expect(mockPetRepository.getPetsByOwnerId).toHaveBeenCalledWith("owner123");
            expect(result).toEqual(mockPets);
        });

        it("should throw error if ownerId not provided", async () => {
            await expect(petService.getAllPetsForUser("")).rejects.toThrow(HttpError);
            await expect(petService.getAllPetsForUser("")).rejects.toThrow("Owner ID is required");
        });
    });

    describe("getAllPets", () => {
        it("should return all pets (admin method)", async () => {
            const mockPets = [
                { _id: "pet1", name: "Buddy" },
                { _id: "pet2", name: "Max" }
            ];

            mockPetRepository.getAllPets = jest.fn().mockResolvedValue(mockPets);

            const result = await petService.getAllPets();

            expect(mockPetRepository.getAllPets).toHaveBeenCalled();
            expect(result).toEqual(mockPets);
        });
    });

    describe("updatePet", () => {
        it("should update pet successfully", async () => {
            const updateDto: UpdatePetDto = {
                name: "Buddy Updated",
                age: 4
            };

            const mockExistingPet = {
                _id: "pet123",
                name: "Buddy",
                ownerId: "owner123"
            };

            const mockUpdatedPet = {
                ...mockExistingPet,
                ...updateDto
            };

            mockPetRepository.getPetById = jest.fn().mockResolvedValue(mockExistingPet);
            mockPetRepository.updatePetById = jest.fn().mockResolvedValue(mockUpdatedPet);

            const result = await petService.updatePet("pet123", "owner123", updateDto);

            expect(mockPetRepository.getPetById).toHaveBeenCalledWith("pet123");
            expect(mockPetRepository.updatePetById).toHaveBeenCalledWith("pet123", updateDto);
            expect(result).toEqual(mockUpdatedPet);
        });
    });

    describe("getPetCare", () => {
        it("should return normalized pet care information", async () => {
            const mockPet = {
                _id: "pet123",
                name: "Buddy",
                ownerId: "owner123",
                care: {
                    feedingTimes: ["8:00 AM", "6:00 PM"],
                    vaccinations: [{ name: "Rabies", date: "2024-01-01" }],
                    notes: "Special diet",
                    updatedAt: new Date()
                }
            };

            mockPetRepository.getPetById = jest.fn().mockResolvedValue(mockPet);

            const result = await petService.getPetCare("pet123", "owner123");

            expect(result).toHaveProperty("feedingTimes");
            expect(result).toHaveProperty("vaccinations");
            expect(result).toHaveProperty("notes");
            expect(result).toHaveProperty("updatedAt");
        });

        it("should return empty arrays and strings for missing care data", async () => {
            const mockPet = {
                _id: "pet123",
                name: "Buddy",
                ownerId: "owner123",
                care: {}
            };

            mockPetRepository.getPetById = jest.fn().mockResolvedValue(mockPet);

            const result = await petService.getPetCare("pet123", "owner123");

            expect(result.feedingTimes).toEqual([]);
            expect(result.vaccinations).toEqual([]);
            expect(result.notes).toBe("");
        });
    });

    describe("updatePetCare", () => {
        it("should update pet care information successfully", async () => {
            const updateCareDto: UpdatePetCareDto = {
                feedingTimes: ["9:00 AM", "7:00 PM"],
                notes: "Updated care instructions"
            };

            const mockExistingPet = {
                _id: "pet123",
                name: "Buddy",
                ownerId: "owner123",
                care: {}
            };

            const mockUpdatedPet = {
                ...mockExistingPet,
                care: {
                    ...updateCareDto,
                    vaccinations: [],
                    updatedAt: new Date()
                }
            };

            mockPetRepository.getPetById = jest.fn().mockResolvedValue(mockExistingPet);
            mockPetRepository.updatePetCareById = jest.fn().mockResolvedValue(mockUpdatedPet);

            const result = await petService.updatePetCare("pet123", "owner123", updateCareDto);

            expect(mockPetRepository.updatePetCareById).toHaveBeenCalledWith("pet123", updateCareDto);
            expect(result).toHaveProperty("feedingTimes");
            expect(result).toHaveProperty("notes");
        });
    });
});
