import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { JWT_SECRET } from "../config";
import type { ChatMessageDto } from "../repositories/chat/chat.repository";

type SocketRole = "user" | "provider";

interface SocketUser {
    id: string;
    role: SocketRole;
}

let io: Server | null = null;

function extractToken(socket: Socket): string | null {
    const authToken = socket.handshake.auth?.token;
    if (typeof authToken === "string" && authToken.trim().length > 0) {
        return authToken.startsWith("Bearer ")
            ? authToken.slice("Bearer ".length).trim()
            : authToken.trim();
    }

    const headerValue = socket.handshake.headers.authorization;
    if (typeof headerValue === "string" && headerValue.startsWith("Bearer ")) {
        return headerValue.slice("Bearer ".length).trim();
    }

    return null;
}

function isObjectId(value: unknown): value is string {
    return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
}

function parseUserFromToken(token: string): SocketUser | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
        const id = decoded.id;
        const role = decoded.role;

        if (!isObjectId(id)) return null;
        if (role !== "user" && role !== "provider") return null;

        return { id, role };
    } catch {
        return null;
    }
}

function getUserRoom(user: SocketUser): string {
    return `${user.role}:${user.id}`;
}

export function initSocketServer(httpServer: HttpServer): Server {
    io = new Server(httpServer, {
        path: "/socket.io",
        cors: {
            origin: true,
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });

    io.use((socket, next) => {
        const token = extractToken(socket);
        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const user = parseUserFromToken(token);
        if (!user) {
            return next(new Error("Unauthorized"));
        }

        (socket.data as any).authUser = user;
        return next();
    });

    io.on("connection", (socket) => {
        const user = (socket.data as any).authUser as SocketUser | undefined;
        if (!user) {
            socket.disconnect(true);
            return;
        }

        socket.join(getUserRoom(user));
    });

    return io;
}

export function emitChatMessage(message: ChatMessageDto): void {
    if (!io) return;

    io.to(`user:${message.senderId}`)
        .to(`provider:${message.senderId}`)
        .emit("chat:message", message);

    io.to(`user:${message.receiverId}`)
        .to(`provider:${message.receiverId}`)
        .emit("chat:message", message);
}

