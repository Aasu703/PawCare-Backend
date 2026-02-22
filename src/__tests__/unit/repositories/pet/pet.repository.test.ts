import { PetRepository } from "../../../../repositories/pet/pet.repository";
import { PetModel } from "../../../../models/pet/pet.model";
import { CreatePetDto, UpdatePetDto, UpdatePet CareDto } from "../../../../dtos/pet/pet.dto";

jest.mock("../../../../models/pet/pet.model");

describe("PetRepository", () => {
    let petRepository: PetRepository;
    let mockPetModel: jest.Mocked<typeof PetModel>;

    beforeEach(() => {
        petRepository = new PetRepository();
        mockPetModel = PetModel as jest.Mocked<typeof PetModel>;
        jest.clearAllMocks();
    });

    describe("createPet", () => {
        it("should create a new pet successfully", async () => {
            const createPetDto: CreatePetDto = {
                name: "Buddy",
                species: "Dog",
                breed: "Golden Retriever",
                age: 3
            };

            const mockPet = {
                _id: "petId123",
                ...createPetDto,
                ownerId: "ownerId123"
            };

            mockPetModel.create = jest.fn().mockResolvedValue(mockPet);

            const result = await petRepository.createPet("ownerId123", createPetDto);

            expect(mockPetModel.create).toHaveBeenCalledWith({
                ...createPetDto,
                ownerId: "ownerId123"
            });
            expect(result).toEqual(mockPet);
        });
    });

    describe("getPetById", () => {
        it("should return pet when found", async () => {
            const mockPet = {
                _id: "petId123",
                name: "Buddy",
                species: "Dog"
            };

            const mockExec = jest.fn().mockResolvedValue(mockPet);
            mockPetModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await petRepository.getPetById("petId123");

            expect(mockPetModel.findById).toHaveBeenCalledWith("petId123");
            expect(result).toEqual(mockPet);
        });

        it("should return null when pet not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockPetModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await petRepository.getPetById("invalidId");

            expect(result).toBeNull();
        });
    });

    describe("getPetsByOwnerId", () => {
        it("should return all pets for an owner", async () => {
            const mockPets = [
                { _id: "pet1", name: "Buddy", ownerId: "owner123" },
                { _id: "pet2", name: "Max", ownerId: "owner123" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockPets);
            mockPetModel.find = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await petRepository.getPetsByOwnerId("owner123");

            expect(mockPetModel.find).toHaveBeenCalledWith({ ownerId: "owner123" });
            expect(result).toEqual(mockPets);
        });
    });

    describe("getAllPets", () => {
        it("should return all pets", async () => {
            const mockPets = [
                { _id: "pet1", name: "Buddy" },
                { _id: "pet2", name: "Max" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockPets);
            mockPetModel.find = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await petRepository.getAllPets();

            expect(mockPetModel.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockPets);
        });
    });

    describe("updatePetById", () => {
        it("should update pet successfully", async () => {
            const updates: UpdatePetDto = {
                name: "Buddy Updated",
                age: 4
            };

            const mockUpdatedPet = {
                _id: "petId123",
                ...updates
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedPet);
            mockPetModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await petRepository.updatePetById("petId123", updates);

            expect(mockPetModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "petId123",
                updates,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedPet);
        });
    });

    describe("updatePetCareById", () => {
        it("should update pet care information with all fields", async () => {
            const updates: UpdatePetCareDto = {
                feedingTimes: ["8:00 AM", "6:00 PM"],
                vaccinations: [{ name: "Rabies", date: "2024-01-01" }],
                notes: "Special care needed"
            };

            const mockUpdatedPet = {
                _id: "petId123",
                care: {
                    feedingTimes: updates.feedingTimes,
                    vaccinations: updates.vaccinations,
                    notes: updates.notes,
                    updatedAt: expect.any(Date)
                }
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedPet);
            mockPetModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await petRepository.updatePetCareById("petId123", updates);

            expect(mockPetModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "petId123",
                {
                    $set: {
                        "care.updatedAt": expect.any(Date),
                        "care.feedingTimes": updates.feedingTimes,
                        "care.vaccinations": updates.vaccinations,
                        "care.notes": updates.notes
                    }
                },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedPet);
        });

        it("should update only feedingTimes when provided", async () => {
            const updates: UpdatePetCareDto = {
                feedingTimes: ["9:00 AM"]
            };

            const mockUpdatedPet = {
                _id: "petId123",
                care: { feedingTimes: updates.feedingTimes }
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedPet);
            mockPetModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            await petRepository.updatePetCareById("petId123", updates);

            const callArgs = (mockPetModel.findByIdAndUpdate as jest.Mock).mock.calls[0][1].$set;
            expect(callArgs["care.feedingTimes"]).toEqual(updates.feedingTimes);
            expect(callArgs["care.vaccinations"]).toBeUndefined();
        });
    });

    describe("deletePetById", () => {
        it("should delete pet successfully", async () => {
            const mockDeletedPet = {
                _id: "petId123",
                name: "Buddy"
            };

            const mockExec = jest.fn().mockResolvedValue(mockDeletedPet);
            mockPetModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await petRepository.deletePetById("petId123");

            expect(mockPetModel.findByIdAndDelete).toHaveBeenCalledWith("petId123");
            expect(result).toEqual(mockDeletedPet);
        });
    });
});
