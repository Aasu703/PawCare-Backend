import z from "zod";
import { MessageSchema } from "../types/message.type";

export const CreateMessageDto = MessageSchema.pick({
    content: true
});

export type CreateMessageDto = z.infer<typeof CreateMessageDto>;

export const UpdateMessageDto = MessageSchema.partial().omit({ id: true, userId: true });
export type UpdateMessageDto = z.infer<typeof UpdateMessageDto>;
