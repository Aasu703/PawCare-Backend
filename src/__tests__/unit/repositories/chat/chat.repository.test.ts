import { ChatRepository } from "../../../../repositories/chat/chat.repository";
import { ChatMessageModel } from "../../../../models/chat/chat-message.model";
import { BookingModel } from "../../../../models/user/booking.model";

jest.mock("../../../../models/chat/chat-message.model");
jest.mock("../../../../models/user/booking.model");
jest.mock("../../../../models/user/booking.model");
jest.mock("../../../../models/provider/provider.model");
jest.mock("../../../../models/user/user.model");

describe("ChatRepository", () => {
    let chatRepository: ChatRepository;
    let mockChatMessageModel: jest.Mocked<typeof ChatMessageModel>;
    let mockBookingModel: jest.Mocked<typeof BookingModel>;

    beforeEach(() => {
        chatRepository = new ChatRepository();
        mockChatMessageModel = ChatMessageModel as jest.Mocked<typeof ChatMessageModel>;
        mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
        jest.clearAllMocks();
    });

    describe("createMessage", () => {
        it("should create a new chat message successfully", async () => {
            const messageParams = {
                content: "Hello, is my appointment confirmed?",
                senderId: "507f1f77bcf86cd799439011",
                senderRole: "user" as const,
                receiverId: "507f1f77bcf86cd799439022",
                receiverRole: "provider" as const
            };

            const mockCreatedMessage = {
                _id: "507f1f77bcf86cd799439033",
                content: messageParams.content,
                senderId: messageParams.senderId,
                senderRole: messageParams.senderRole,
                receiverId: messageParams.receiverId,
                receiverRole: messageParams.receiverRole,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockChatMessageModel.create = jest.fn().mockResolvedValue(mockCreatedMessage);

            const result = await chatRepository.createMessage(messageParams);

            expect(mockChatMessageModel.create).toHaveBeenCalled();
            expect(result).toHaveProperty("content", messageParams.content);
            expect(result).toHaveProperty("senderId");
            expect(result).toHaveProperty("receiverId");
        });
    });

    describe("getConversationMessages", () => {
        it("should return paginated messages for a conversation", async () => {
            const mockMessages = [
                {
                    _id: "507f1f77bcf86cd799439033",
                    content: "Hi",
                    senderId: "507f1f77bcf86cd799439011",
                    senderRole: "user",
                    receiverId: "507f1f77bcf86cd799439022",
                    receiverRole: "provider",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            const mockExec = jest.fn().mockResolvedValue(mockMessages);
            const mockLean = jest.fn().mockReturnValue(mockMessages);
            const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
            mockChatMessageModel.find = jest.fn().mockReturnValue({ sort: mockSort });

            const mockCountExec = jest.fn().mockResolvedValue(10);
            mockChatMessageModel.countDocuments = jest.fn().mockReturnValue(mockCountExec);

            const params = {
                currentUserId: "507f1f77bcf86cd799439011",
                currentRole: "user" as const,
                participantId: "507f1f77bcf86cd799439022",
                participantRole: "provider" as const,
                page: 1,
                limit: 20
            };

            const result = await chatRepository.getConversationMessages(params);

            expect(result).toHaveProperty("messages");
            expect(result).toHaveProperty("total");
            expect(result).toHaveProperty("page", 1);
            expect(result).toHaveProperty("limit", 20);
        });
    });

    describe("getConversations", () => {
        it("should return conversations for a user", async () => {
            const params = {
                currentUserId: "507f1f77bcf86cd799439011",
                currentRole: "user" as const,
                page: 1,
                limit: 10
            };

            // This is a complex method that would need extensive mocking
            // For now, we'll create a basic structure test
            const mockAggregate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([])
            });
            mockChatMessageModel.aggregate = mockAggregate;

            const result = await chatRepository.getConversations(params);

            expect(result).toHaveProperty("conversations");
            expect(result).toHaveProperty("total");
            expect(result).toHaveProperty("page");
        });
    });

    describe("getContacts", () => {
        it("should return user contacts", async () => {
            const params = {
                currentUserId: "507f1f77bcf86cd799439011",
                currentRole: "user" as const
            };

            // Mock BookingModel.distinct to return provider IDs
            mockBookingModel.distinct = jest.fn().mockResolvedValue([]);

            const result = await chatRepository.getContacts(params);

            expect(Array.isArray(result)).toBe(true);
        });
    });
});
