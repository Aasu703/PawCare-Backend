import { HttpError } from "../../errors/http-error";
import {
    ChatContact,
    ChatMessageDto,
    ChatRepository,
    PaginatedChatMessages,
    PaginatedConversations,
} from "../../repositories/chat/chat.repository";
import { ChatRole } from "../../models/chat/chat-message.model";

const chatRepository = new ChatRepository();

export class ChatService {
    private isObjectId(value: string): boolean {
        return /^[a-fA-F0-9]{24}$/.test(value);
    }

    private validateRole(role: string): role is ChatRole {
        return role === "user" || role === "provider";
    }

    private ensureParticipantRoles(currentRole: ChatRole, participantRole: ChatRole) {
        if (currentRole === participantRole) {
            throw new HttpError(
                400,
                "Direct chat must be between a user and a provider",
            );
        }
    }

    async createMessage(params: {
        content: string;
        senderId: string;
        senderRole: string;
        receiverId: string;
        receiverRole: string;
    }): Promise<ChatMessageDto> {
        if (!this.validateRole(params.senderRole) || !this.validateRole(params.receiverRole)) {
            throw new HttpError(400, "Invalid chat role");
        }
        if (!this.isObjectId(params.senderId) || !this.isObjectId(params.receiverId)) {
            throw new HttpError(400, "Invalid participant id");
        }
        this.ensureParticipantRoles(params.senderRole, params.receiverRole);

        const content = params.content.trim();
        if (!content) {
            throw new HttpError(400, "Message content is required");
        }

        return chatRepository.createMessage({
            content,
            senderId: params.senderId,
            senderRole: params.senderRole,
            receiverId: params.receiverId,
            receiverRole: params.receiverRole,
        });
    }

    async getConversationMessages(params: {
        currentUserId: string;
        currentRole: string;
        participantId: string;
        participantRole: string;
        page: number;
        limit: number;
    }): Promise<PaginatedChatMessages> {
        if (!this.validateRole(params.currentRole) || !this.validateRole(params.participantRole)) {
            throw new HttpError(400, "Invalid chat role");
        }
        if (!this.isObjectId(params.currentUserId) || !this.isObjectId(params.participantId)) {
            throw new HttpError(400, "Invalid participant id");
        }
        this.ensureParticipantRoles(params.currentRole, params.participantRole);

        return chatRepository.getConversationMessages({
            currentUserId: params.currentUserId,
            currentRole: params.currentRole,
            participantId: params.participantId,
            participantRole: params.participantRole,
            page: params.page,
            limit: params.limit,
        });
    }

    async getConversations(params: {
        currentUserId: string;
        currentRole: string;
        page: number;
        limit: number;
    }): Promise<PaginatedConversations> {
        if (!this.validateRole(params.currentRole)) {
            throw new HttpError(400, "Invalid chat role");
        }
        if (!this.isObjectId(params.currentUserId)) {
            throw new HttpError(400, "Invalid participant id");
        }

        return chatRepository.getConversations({
            currentUserId: params.currentUserId,
            currentRole: params.currentRole,
            page: params.page,
            limit: params.limit,
        });
    }

    async getContacts(params: {
        currentUserId: string;
        currentRole: string;
    }): Promise<ChatContact[]> {
        if (!this.validateRole(params.currentRole)) {
            throw new HttpError(400, "Invalid chat role");
        }
        if (!this.isObjectId(params.currentUserId)) {
            throw new HttpError(400, "Invalid participant id");
        }

        return chatRepository.getContacts({
            currentUserId: params.currentUserId,
            currentRole: params.currentRole,
        });
    }
}

export default new ChatService();
