import mongoose from "mongoose";
import { BookingModel } from "../../models/user/booking.model";
import { ProviderModel } from "../../models/provider/provider.model";
import { UserModel } from "../../models/user/user.model";
import {
    ChatMessageModel,
    ChatRole,
    IChatMessage,
} from "../../models/chat/chat-message.model";

export interface ConversationSummary {
    participantId: string;
    participantRole: ChatRole;
    participantName: string;
    participantImage?: string;
    participantSubtitle?: string;
    lastMessage: string;
    lastMessageAt: Date;
    lastMessageSenderId: string;
    lastMessageSenderRole: ChatRole;
}

export interface PaginatedConversations {
    conversations: ConversationSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ChatMessageDto {
    id: string;
    content: string;
    senderId: string;
    senderRole: ChatRole;
    receiverId: string;
    receiverRole: ChatRole;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PaginatedChatMessages {
    messages: ChatMessageDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ChatContact {
    participantId: string;
    participantRole: ChatRole;
    name: string;
    imageUrl?: string;
    subtitle?: string;
}

interface ParticipantRef {
    id: string;
    role: ChatRole;
}

interface ParticipantProfile {
    name: string;
    imageUrl?: string;
    subtitle?: string;
}

interface ConversationAggRow {
    _id: {
        participantId: mongoose.Types.ObjectId;
        participantRole: ChatRole;
    };
    lastMessage: string;
    lastMessageAt: Date;
    lastMessageSenderId: mongoose.Types.ObjectId;
    lastMessageSenderRole: ChatRole;
}

interface ConversationsAggregateResult {
    items: ConversationAggRow[];
    total: Array<{ count: number }>;
}

export class ChatRepository {
    private profileKey(id: string, role: ChatRole): string {
        return `${role}:${id}`;
    }

    private mapMessage(message: IChatMessage | Record<string, unknown>): ChatMessageDto {
        const value = message as Record<string, unknown>;
        return {
            id:
                (value.id as string | undefined) ??
                (value._id as mongoose.Types.ObjectId | undefined)?.toString() ??
                "",
            content: (value.content as string) ?? "",
            senderId: (value.senderId as mongoose.Types.ObjectId).toString(),
            senderRole: value.senderRole as ChatRole,
            receiverId: (value.receiverId as mongoose.Types.ObjectId).toString(),
            receiverRole: value.receiverRole as ChatRole,
            createdAt: value.createdAt as Date | undefined,
            updatedAt: value.updatedAt as Date | undefined,
        };
    }

    private async resolveProfiles(
        participants: ParticipantRef[],
    ): Promise<Map<string, ParticipantProfile>> {
        const userIds = participants
            .filter((item) => item.role === "user")
            .map((item) => new mongoose.Types.ObjectId(item.id));
        const providerIds = participants
            .filter((item) => item.role === "provider")
            .map((item) => new mongoose.Types.ObjectId(item.id));

        const profileMap = new Map<string, ParticipantProfile>();

        if (userIds.length > 0) {
            const users = await UserModel.find({ _id: { $in: userIds } })
                .select("_id Firstname Lastname email imageUrl")
                .lean();

            users.forEach((user: any) => {
                const id = user._id.toString();
                const fullName = `${user.Firstname ?? ""} ${user.Lastname ?? ""}`.trim();
                profileMap.set(this.profileKey(id, "user"), {
                    name: fullName || user.email || "User",
                    imageUrl: user.imageUrl || undefined,
                    subtitle: user.email || undefined,
                });
            });
        }

        if (providerIds.length > 0) {
            const providers = await ProviderModel.find({ _id: { $in: providerIds } })
                .select("_id businessName email providerType")
                .lean();

            providers.forEach((provider: any) => {
                const id = provider._id.toString();
                profileMap.set(this.profileKey(id, "provider"), {
                    name: provider.businessName || provider.email || "Provider",
                    subtitle: provider.providerType
                        ? `${provider.providerType} provider`
                        : provider.email || undefined,
                });
            });
        }

        return profileMap;
    }

    async createMessage(params: {
        content: string;
        senderId: string;
        senderRole: ChatRole;
        receiverId: string;
        receiverRole: ChatRole;
    }): Promise<ChatMessageDto> {
        const created = await ChatMessageModel.create({
            content: params.content,
            senderId: new mongoose.Types.ObjectId(params.senderId),
            senderRole: params.senderRole,
            receiverId: new mongoose.Types.ObjectId(params.receiverId),
            receiverRole: params.receiverRole,
        });
        return this.mapMessage(created);
    }

    async getConversationMessages(params: {
        currentUserId: string;
        currentRole: ChatRole;
        participantId: string;
        participantRole: ChatRole;
        page: number;
        limit: number;
    }): Promise<PaginatedChatMessages> {
        const currentObjectId = new mongoose.Types.ObjectId(params.currentUserId);
        const participantObjectId = new mongoose.Types.ObjectId(params.participantId);
        const skip = (params.page - 1) * params.limit;

        const query = {
            $or: [
                {
                    senderId: currentObjectId,
                    senderRole: params.currentRole,
                    receiverId: participantObjectId,
                    receiverRole: params.participantRole,
                },
                {
                    senderId: participantObjectId,
                    senderRole: params.participantRole,
                    receiverId: currentObjectId,
                    receiverRole: params.currentRole,
                },
            ],
        };

        const [messages, total] = await Promise.all([
            ChatMessageModel.find(query)
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(params.limit)
                .lean(),
            ChatMessageModel.countDocuments(query),
        ]);

        return {
            messages: messages.map((message) => this.mapMessage(message)),
            total,
            page: params.page,
            limit: params.limit,
            totalPages: Math.ceil(total / params.limit) || 1,
        };
    }

    async getConversations(params: {
        currentUserId: string;
        currentRole: ChatRole;
        page: number;
        limit: number;
    }): Promise<PaginatedConversations> {
        const currentObjectId = new mongoose.Types.ObjectId(params.currentUserId);
        const skip = (params.page - 1) * params.limit;

        const aggregatePipeline: Record<string, unknown>[] = [
            {
                $match: {
                    $or: [
                        {
                            senderId: currentObjectId,
                            senderRole: params.currentRole,
                        },
                        {
                            receiverId: currentObjectId,
                            receiverRole: params.currentRole,
                        },
                    ],
                },
            },
            {
                $addFields: {
                    participantId: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$senderId", currentObjectId] },
                                    { $eq: ["$senderRole", params.currentRole] },
                                ],
                            },
                            "$receiverId",
                            "$senderId",
                        ],
                    },
                    participantRole: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$senderId", currentObjectId] },
                                    { $eq: ["$senderRole", params.currentRole] },
                                ],
                            },
                            "$receiverRole",
                            "$senderRole",
                        ],
                    },
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        participantId: "$participantId",
                        participantRole: "$participantRole",
                    },
                    lastMessage: { $first: "$content" },
                    lastMessageAt: { $first: "$createdAt" },
                    lastMessageSenderId: { $first: "$senderId" },
                    lastMessageSenderRole: { $first: "$senderRole" },
                },
            },
            { $sort: { lastMessageAt: -1 } },
            {
                $facet: {
                    items: [{ $skip: skip }, { $limit: params.limit }],
                    total: [{ $count: "count" }],
                },
            },
        ];

        const aggregateResult = await ChatMessageModel.aggregate(
            aggregatePipeline as any,
        ).exec();
        const rawResult = (aggregateResult[0] ?? {
            items: [],
            total: [],
        }) as ConversationsAggregateResult;

        const rawItems = rawResult.items;
        const totalCount = rawResult.total[0]?.count ?? 0;

        const participants: ParticipantRef[] = rawItems.map((item) => ({
            id: item._id.participantId.toString(),
            role: item._id.participantRole,
        }));

        const profileMap = await this.resolveProfiles(participants);

        const conversations: ConversationSummary[] = rawItems.map((item) => {
            const participantId = item._id.participantId.toString();
            const participantRole = item._id.participantRole;
            const profile = profileMap.get(
                this.profileKey(participantId, participantRole),
            );

            return {
                participantId,
                participantRole,
                participantName:
                    profile?.name ??
                    (participantRole === "provider" ? "Provider" : "User"),
                participantImage: profile?.imageUrl,
                participantSubtitle: profile?.subtitle,
                lastMessage: item.lastMessage,
                lastMessageAt: item.lastMessageAt,
                lastMessageSenderId: item.lastMessageSenderId.toString(),
                lastMessageSenderRole: item.lastMessageSenderRole,
            };
        });

        return {
            conversations,
            total: totalCount,
            page: params.page,
            limit: params.limit,
            totalPages: Math.ceil(totalCount / params.limit) || 1,
        };
    }

    async getContacts(params: {
        currentUserId: string;
        currentRole: ChatRole;
    }): Promise<ChatContact[]> {
        if (params.currentRole === "provider") {
            const userIds = await BookingModel.distinct("userId", {
                providerId: params.currentUserId,
                userId: { $ne: null },
            });

            if (userIds.length === 0) return [];

            const users = await UserModel.find({ _id: { $in: userIds } })
                .select("_id Firstname Lastname email imageUrl")
                .sort({ Firstname: 1, Lastname: 1 })
                .lean();

            return users.map((user: any) => {
                const fullName = `${user.Firstname ?? ""} ${user.Lastname ?? ""}`.trim();
                return {
                    participantId: user._id.toString(),
                    participantRole: "user" as const,
                    name: fullName || user.email || "User",
                    imageUrl: user.imageUrl || undefined,
                    subtitle: user.email || undefined,
                };
            });
        }

        const providerIds = await BookingModel.distinct("providerId", {
            userId: params.currentUserId,
            providerId: { $ne: null },
        });

        if (providerIds.length === 0) return [];

        const providers = await ProviderModel.find({ _id: { $in: providerIds } })
            .select("_id businessName email providerType")
            .sort({ businessName: 1 })
            .lean();

        return providers.map((provider: any) => ({
            participantId: provider._id.toString(),
            participantRole: "provider" as const,
            name: provider.businessName || provider.email || "Provider",
            subtitle: provider.providerType
                ? `${provider.providerType} provider`
                : provider.email || undefined,
        }));
    }
}
