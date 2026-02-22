import { HealthRecordRepository } from "../../../../repositories/pet/healthrecord.repository";
import { HealthRecordModel } from "../../../../models/pet/healthrecord.model";
import { CreateHealthRecordDto, UpdateHealthRecordDto } from "../../../../dtos/pet/healthrecord.dto";

jest.mock("../../../../models/pet/healthrecord.model");

describe("HealthRecordRepository", () => {
    let healthRecordRepository: HealthRecordRepository;
    let mockHealthRecordModel: jest.Mocked<typeof HealthRecordModel>;

    beforeEach(() => {
        healthRecordRepository = new HealthRecordRepository();
        mockHealthRecordModel = HealthRecordModel as jest.Mocked<typeof HealthRecordModel>;
        jest.clearAllMocks();
    });

    describe("createHealthRecord", () => {
        it("should create a new health record successfully", async () => {
            const createHealthRecordDto: CreateHealthRecordDto = {
                petId: "petId123",
                date: "2024-01-15",
                recordType: "checkup",
                title: "Annual Checkup",
                description: "Annual checkup"
            };

            const mockHealthRecord = {
                _id: "recordId123",
                ...createHealthRecordDto
            };

            mockHealthRecordModel.create = jest.fn().mockResolvedValue(mockHealthRecord);

            const result = await healthRecordRepository.createHealthRecord(createHealthRecordDto);

            expect(mockHealthRecordModel.create).toHaveBeenCalledWith(createHealthRecordDto);
            expect(result).toEqual(mockHealthRecord);
        });
    });

    describe("getHealthRecordById", () => {
        it("should return health record when found", async () => {
            const mockRecord = {
                _id: "recordId123",
                petId: "petId123",
                type: "vaccination"
            };

            const mockExec = jest.fn().mockResolvedValue(mockRecord);
            mockHealthRecordModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await healthRecordRepository.getHealthRecordById("recordId123");

            expect(mockHealthRecordModel.findById).toHaveBeenCalledWith("recordId123");
            expect(result).toEqual(mockRecord);
        });

        it("should return null when record not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockHealthRecordModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await healthRecordRepository.getHealthRecordById("invalidId");

            expect(result).toBeNull();
        });
    });

    describe("getHealthRecordsByPetId", () => {
        it("should return all health records for a pet sorted by date", async () => {
            const mockRecords = [
                { _id: "rec1", petId: "petId123", date: "2024-02-01" },
                { _id: "rec2", petId: "petId123", date: "2024-01-01" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockRecords);
            const mockSort = jest.fn().mockReturnValue({ exec: mockExec });
            mockHealthRecordModel.find = jest.fn().mockReturnValue({ sort: mockSort });

            const result = await healthRecordRepository.getHealthRecordsByPetId("petId123");

            expect(mockHealthRecordModel.find).toHaveBeenCalledWith({ petId: "petId123" });
            expect(mockSort).toHaveBeenCalledWith({ date: -1 });
            expect(result).toEqual(mockRecords);
        });
    });

    describe("getAllHealthRecords", () => {
        it("should return paginated health records", async () => {
            const mockRecords = [
                { _id: "rec1", type: "checkup" },
                { _id: "rec2", type: "vaccination" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockRecords);
            const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            mockHealthRecordModel.find = jest.fn().mockReturnValue({ skip: mockSkip });

            const mockCountExec = jest.fn().mockResolvedValue(20);
            mockHealthRecordModel.countDocuments = jest.fn().mockReturnValue({ exec: mockCountExec });

            const result = await healthRecordRepository.getAllHealthRecords(1, 10);

            expect(mockHealthRecordModel.find).toHaveBeenCalled();
            expect(mockSkip).toHaveBeenCalledWith(0);
            expect(mockLimit).toHaveBeenCalledWith(10);
            expect(result).toEqual({
                records: mockRecords,
                total: 20,
                page: 1,
                limit: 10,
                totalPages: 2
            });
        });
    });

    describe("updateHealthRecordById", () => {
        it("should update health record successfully", async () => {
            const updates: UpdateHealthRecordDto = {
                description: "Updated description"
            };

            const mockUpdatedRecord = {
                _id: "recordId123",
                ...updates
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedRecord);
            mockHealthRecordModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await healthRecordRepository.updateHealthRecordById("recordId123", updates);

            expect(mockHealthRecordModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "recordId123",
                updates,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedRecord);
        });
    });

    describe("deleteHealthRecordById", () => {
        it("should delete health record successfully", async () => {
            const mockDeletedRecord = {
                _id: "recordId123"
            };

            const mockExec = jest.fn().mockResolvedValue(mockDeletedRecord);
            mockHealthRecordModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await healthRecordRepository.deleteHealthRecordById("recordId123");

            expect(mockHealthRecordModel.findByIdAndDelete).toHaveBeenCalledWith("recordId123");
            expect(result).toEqual(mockDeletedRecord);
        });
    });

    describe("incrementAttachmentsCount", () => {
        it("should increment attachments count", async () => {
            const mockRecord = {
                _id: "recordId123",
                attachmentsCount: 2
            };

            const mockExec = jest.fn().mockResolvedValue(mockRecord);
            mockHealthRecordModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await healthRecordRepository.incrementAttachmentsCount("recordId123");

            expect(mockHealthRecordModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "recordId123",
                { $inc: { attachmentsCount: 1 } },
                { new: true }
            );
            expect(result).toEqual(mockRecord);
        });
    });

    describe("decrementAttachmentsCount", () => {
        it("should decrement attachments count", async () => {
            const mockRecord = {
                _id: "recordId123",
                attachmentsCount: 1
            };

            const mockExec = jest.fn().mockResolvedValue(mockRecord);
            mockHealthRecordModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await healthRecordRepository.decrementAttachmentsCount("recordId123");

            expect(mockHealthRecordModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "recordId123",
                { $inc: { attachmentsCount: -1 } },
                { new: true }
            );
            expect(result).toEqual(mockRecord);
        });
    });
});
