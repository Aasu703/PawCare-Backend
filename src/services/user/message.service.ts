import { CreateMessageDto, UpdateMessageDto } from "../../dtos/user/message.dto";
import { HttpError } from "../../errors/http-error";
import { MessageRepository } from "../../repositories/user/message.repository";

const messageRepository = new MessageRepository();

interface GetAllMessagesResult {
    messages: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class MessageService {
    async createMessage(data: CreateMessageDto, userId: string) {
        return messageRepository.createMessage(data, userId);
    }

    async getMessageById(id: string) {
        const message = await messageRepository.getMessageById(id);
        if (!message) {
            throw new HttpError(404, "Message not found");
        }
        return message;
    }

    async getAllMessages(page: number = 1, limit: number = 10): Promise<GetAllMessagesResult> {
        return messageRepository.getAllMessages(page, limit);
    }

    async getMessagesByUserId(userId: string) {
        return messageRepository.getMessagesByUserId(userId);
    }

    async updateMessage(id: string, userId: string, data: UpdateMessageDto, role?: string) {
        return messageRepository.updateMessageById(id, data);
    }

    async deleteMessage(id: string, userId: string, role?: string) {
        return messageRepository.deleteMessageById(id);
    }
}
