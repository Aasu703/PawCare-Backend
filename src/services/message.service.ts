import { CreateMessageDto, UpdateMessageDto } from "../dtos/message.dto";
import { HttpError } from "../errors/http-error";
import { MessageRepository } from "../repositories/message.repository";

const messageRepository = new MessageRepository();

export class MessageService {
    async createMessage(data: CreateMessageDto, userId: string) {
        if (!userId) {
            throw new HttpError(400, "User ID is required");
        }
        return messageRepository.createMessage(data, userId);
    }

    async getMessageById(id: string) {
        const message = await messageRepository.getMessageById(id);
        if (!message) {
            throw new HttpError(404, "Message not found");
        }
        return message;
    }

    async getAllMessages(page: number = 1, limit: number = 10) {
        return messageRepository.getAllMessages(page, limit);
    }

    async getMessagesByUserId(userId: string) {
        return messageRepository.getMessagesByUserId(userId);
    }

    async updateMessage(id: string, userId: string, data: UpdateMessageDto, role?: string) {
        const existing = await messageRepository.getMessageById(id);
        if (!existing) {
            throw new HttpError(404, "Message not found");
        }
        if (role !== "admin" && existing.userId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const updated = await messageRepository.updateMessageById(id, data);
        if (!updated) {
            throw new HttpError(404, "Message not found");
        }
        return updated;
    }

    async deleteMessage(id: string, userId: string, role?: string) {
        const existing = await messageRepository.getMessageById(id);
        if (!existing) {
            throw new HttpError(404, "Message not found");
        }
        if (role !== "admin" && existing.userId?.toString() !== userId?.toString()) {
            throw new HttpError(403, "Forbidden");
        }
        const deleted = await messageRepository.deleteMessageById(id);
        if (!deleted) {
            throw new HttpError(404, "Message not found");
        }
        return deleted;
    }
}
