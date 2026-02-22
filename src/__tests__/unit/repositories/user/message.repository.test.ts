import { MessageRepository } from "../../../../repositories/user/message.repository";
import { MessageModel } from "../../../../models/user/message.model";
import { CreateMessageDto, UpdateMessageDto } from "../../../../dtos/user/message.dto";

jest.mock("../../../../models/user/message.model");

describe("MessageRepository", () => {
    let messageRepository: MessageRepository;
    let mockMessageModel: jest.Mocked<typeof MessageModel>;

    beforeEach(() => {
        messageRepository = new MessageRepository();
        mockMessageModel = MessageModel as jest.Mocked<typeof MessageModel>;
        jest.clearAllMocks();
    });

    describe("createMessage", () => {
        it("should create a new message successfully", async () => {
            const createMessageDto: CreateMessageDto = {
                content: "Test message",
                receiverId: "receiver123"
            };

            const mockMessage = {
                _id: "messageId123",
                ...createMessageDto,
                userId: "userId123"
            };

            mockMessageModel.create = jest.fn().mockResolvedValue(mockMessage);

            const result = await messageRepository.createMessage(createMessageDto, "userId123");

            expect(mockMessageModel.create).toHaveBeenCalledWith({
                ...createMessageDto,
                userId: "userId123"
            });
            expect(result).toEqual(mockMessage);
        });
    });

    describe("getMessageById", () => {
        it("should return message when found", async () => {
            const mockMessage = {
                _id: "messageId123",
                content: "Test message"
            };

            const mockExec = jest.fn().mockResolvedValue(mockMessage);
            mockMessageModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await messageRepository.getMessageById("messageId123");

            expect(mockMessageModel.findById).toHaveBeenCalledWith("messageId123");
            expect(result).toEqual(mockMessage);
        });

        it("should return null when message not found", async () => {
            const mockExec = jest.fn().mockResolvedValue(null);
            mockMessageModel.findById = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await messageRepository.getMessageById("invalidId");

            expect(result).toBeNull();
        });
    });

    describe("getAllMessages", () => {
        it("should return paginated messages", async () => {
            const mockMessages = [
                { _id: "msg1", content: "Message 1" },
                { _id: "msg2", content: "Message 2" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockMessages);
            const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
            const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
            mockMessageModel.find = jest.fn().mockReturnValue({ populate: mockPopulate });

            const mockCountExec = jest.fn().mockResolvedValue(20);
            mockMessageModel.countDocuments = jest.fn().mockReturnValue({ exec: mockCountExec });

            const result = await messageRepository.getAllMessages(1, 10);

            expect(mockMessageModel.find).toHaveBeenCalled();
            expect(mockPopulate).toHaveBeenCalledWith({
                path: "userId",
                select: "Firstname Lastname email imageUrl"
            });
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(result).toEqual({
                messages: mockMessages,
                total: 20,
                page: 1,
                limit: 10,
                totalPages: 2
            });
        });
    });

    describe("getMessagesByUserId", () => {
        it("should return messages for a specific user", async () => {
            const mockMessages = [
                { _id: "msg1", userId: "userId123" }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockMessages);
            const mockSort = jest.fn().mockReturnValue({ exec: mockExec });
            const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
            mockMessageModel.find = jest.fn().mockReturnValue({ populate: mockPopulate });

            const result = await messageRepository.getMessagesByUserId("userId123");

            expect(mockMessageModel.find).toHaveBeenCalledWith({ userId: "userId123" });
            expect(result).toEqual(mockMessages);
        });
    });

    describe("updateMessageById", () => {
        it("should update message successfully", async () => {
            const updates: UpdateMessageDto = {
                content: "Updated message"
            };

            const mockUpdatedMessage = {
                _id: "messageId123",
                content: "Updated message"
            };

            const mockExec = jest.fn().mockResolvedValue(mockUpdatedMessage);
            mockMessageModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await messageRepository.updateMessageById("messageId123", updates);

            expect(mockMessageModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "messageId123",
                updates,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedMessage);
        });
    });

    describe("deleteMessageById", () => {
        it("should delete message successfully", async () => {
            const mockDeletedMessage = {
                _id: "messageId123"
            };

            const mockExec = jest.fn().mockResolvedValue(mockDeletedMessage);
            mockMessageModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });

            const result = await messageRepository.deleteMessageById("messageId123");

            expect(mockMessageModel.findByIdAndDelete).toHaveBeenCalledWith("messageId123");
            expect(result).toEqual(mockDeletedMessage);
        });
    });
});
