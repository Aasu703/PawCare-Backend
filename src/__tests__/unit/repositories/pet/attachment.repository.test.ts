import { AttachmentRepository } from "../../../../repositories/pet/attachment.repository";
import { AttachmentModel } from "../../../../models/pet/attachment.model";
import { CreateAttachmentDto, UpdateAttachmentDto } from "../../../../dtos/pet/attachment.dto";

jest.mock("../../../../models/pet/attachment.model");

describe("AttachmentRepository", () => {
    let attachmentRepository: AttachmentRepository;
    let mockAttachmentModel: jest.Mocked<typeof AttachmentModel>;

    beforeEach(() => {
        attachmentRepository = new AttachmentRepository();
        mockAttachmentModel = AttachmentModel as jest.Mocked<typeof AttachmentModel>;
        jest.clearAllMocks();
    });

    describe("createAttachment", () => {
        it("should create a new attachment successfully", async () => {
            const createAttachmentDto: CreateAttachmentDto = {
                healthRecordId: "recordId123",
                fileName: "xray.jpg",
                fileUrl: "https://example.com/files/xray.jpg"
            };

            const mockAttachment = {
                _id: "attachmentId123",
                ...createAttachmentDto
            };

            mockAttachmentModel.create = jest.fn().mockResolvedValue(mockAttachment);

            const result = await attachmentRepository.createAttachment(createAttachmentDto);

            expect(mockAttachmentModel.create).toHaveBeenCalledWith(createAttachmentDto);
            expect(result).toEqual(mockAttachment);
        });
    });

    describe("getAttachmentById", () => {
        it("should return attachment when found", async () => {
            const mockAttachment = {
                _id: "attachmentId123",
                fileName: "xray.jpg",
                healthRecordId: "recordId123"
            };

            const mockExec = jest.fn().mockResolvedValue(mockAttachment);
            mockAttachmentModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await attachmentRepository.getAttachmentById("attachmentId123");

            expect(mockAttachmentModel.findById).toHaveBeenCalledWith("attachmentId123");
            expect(result).toEqual(mockAttachment);
        });

        it("should return null when attachment not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockAttachmentModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await attachmentRepository.getAttachmentById("invalidId");

            expect(result).toBeNull();
        });
    });

    describe("getAttachmentsByHealthRecordId", () => {
        it("should return all attachments for a health record", async () => {
            const mockAttachments = [
                { _id: "att1", healthRecordId: "recordId123", fileName: "xray.jpg" },
                { _id: "att2", healthRecordId: "recordId123", fileName: "report.pdf" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockAttachments);
            mockAttachmentModel.find = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await attachmentRepository.getAttachmentsByHealthRecordId("recordId123");

            expect(mockAttachmentModel.find).toHaveBeenCalledWith({ healthRecordId: "recordId123" });
            expect(result).toEqual(mockAttachments);
        });
    });

    describe("updateAttachmentById", () => {
        it("should update attachment successfully", async () => {
            const updates: UpdateAttachmentDto = {
                fileName: "updated-xray.jpg"
            };

            const mockUpdatedAttachment = {
                _id: "attachmentId123",
                fileName: "updated-xray.jpg"
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedAttachment);
            mockAttachmentModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await attachmentRepository.updateAttachmentById("attachmentId123", updates);

            expect(mockAttachmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "attachmentId123",
                updates,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedAttachment);
        });
    });

    describe("deleteAttachmentById", () => {
        it("should delete attachment successfully", async () => {
            const mockDeletedAttachment = {
                _id: "attachmentId123",
                fileName: "xray.jpg"
            };

            const mockExec = jest.fn().mockResolvedValue(mockDeletedAttachment);
            mockAttachmentModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await attachmentRepository.deleteAttachmentById("attachmentId123");

            expect(mockAttachmentModel.findByIdAndDelete).toHaveBeenCalledWith("attachmentId123");
            expect(result).toEqual(mockDeletedAttachment);
        });
    });

    describe("deleteAttachmentsByHealthRecordId", () => {
        it("should delete all attachments for a health record", async () => {
            const mockExec = jest.fn().mockResolvedValue({ deletedCount: 3 });
            mockAttachmentModel.deleteMany = jest.fn().mockReturnValue({ exec: mockExec });

            await attachmentRepository.deleteAttachmentsByHealthRecordId("recordId123");

            expect(mockAttachmentModel.deleteMany).toHaveBeenCalledWith({ healthRecordId: "recordId123" });
            expect(mockExec).toHaveBeenCalled();
        });
    });
});
