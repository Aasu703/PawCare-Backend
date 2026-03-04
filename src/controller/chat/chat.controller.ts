import { Request, Response } from "express";
import { HttpError } from "../../errors/http-error";
import chatService from "../../services/chat/chat.service";
import { ChatRole } from "../../models/chat/chat-message.model";
import { emitChatMessage } from "../../realtime/socket-server";

class ChatController {
    private resolveIdentity(req: Request): { userId: string; role: ChatRole } {
        const requestUser = (req.user as Record<string, unknown> | undefined) ?? {};
        const role = requestUser.role;
        const rawId = requestUser._id ?? requestUser.id;
        const userId = rawId ? rawId.toString() : "";

        if (!userId || (role !== "user" && role !== "provider")) {
            throw new HttpError(401, "Unauthorized");
        }

        return { userId, role };
    }

    private resolveParticipantRole(
        currentRole: ChatRole,
        inputRole: unknown,
    ): ChatRole {
        if (inputRole === "user" || inputRole === "provider") {
            return inputRole;
        }
        return currentRole === "provider" ? "user" : "provider";
    }

    async getConversations(req: Request, res: Response) {
        try {
            const { userId, role } = this.resolveIdentity(req);
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 20;

            const result = await chatService.getConversations({
                currentUserId: userId,
                currentRole: role,
                page,
                limit,
            });

            return res.status(200).json({
                success: true,
                message: "Conversations fetched",
                data: result,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async getConversationMessages(req: Request, res: Response) {
        try {
            const { userId, role } = this.resolveIdentity(req);
            const participantId = req.params.participantId;
            const participantRole = this.resolveParticipantRole(
                role,
                req.query.participantRole,
            );
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 50;

            const result = await chatService.getConversationMessages({
                currentUserId: userId,
                currentRole: role,
                participantId,
                participantRole,
                page,
                limit,
            });

            return res.status(200).json({
                success: true,
                message: "Conversation messages fetched",
                data: result,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async createMessage(req: Request, res: Response) {
        try {
            const { userId, role } = this.resolveIdentity(req);
            const participantId = req.params.participantId;
            const participantRole = this.resolveParticipantRole(
                role,
                req.body?.participantRole ?? req.query.participantRole,
            );
            const content = (req.body?.content ?? "").toString();

            const result = await chatService.createMessage({
                content,
                senderId: userId,
                senderRole: role,
                receiverId: participantId,
                receiverRole: participantRole,
            });
            emitChatMessage(result);

            return res.status(201).json({
                success: true,
                message: "Message sent",
                data: result,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async getContacts(req: Request, res: Response) {
        try {
            const { userId, role } = this.resolveIdentity(req);
            const contacts = await chatService.getContacts({
                currentUserId: userId,
                currentRole: role,
            });

            return res.status(200).json({
                success: true,
                message: "Chat contacts fetched",
                data: contacts,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}

export default new ChatController();
