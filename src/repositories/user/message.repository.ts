import { MessageModel, IMessage } from "../../models/user/message.model";
import { CreateMessageDto, UpdateMessageDto } from "../../dtos/user/message.dto";

export class MessageRepository {
    async createMessage(data: CreateMessageDto, userId: string): Promise<IMessage> {
        return MessageModel.create({ ...data, userId });
    }

    async getMessageById(id: string): Promise<IMessage | null> {
        return MessageModel.findById(id).exec();
    }

    async getAllMessages(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [messages, total] = await Promise.all([
            MessageModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            MessageModel.countDocuments().exec()
        ]);
        return { messages, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getMessagesByUserId(userId: string): Promise<IMessage[]> {
        return MessageModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }

    async updateMessageById(id: string, updates: UpdateMessageDto): Promise<IMessage | null> {
        return MessageModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteMessageById(id: string): Promise<IMessage | null> {
        return MessageModel.findByIdAndDelete(id).exec();
    }
}
