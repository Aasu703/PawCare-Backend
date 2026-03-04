// This module sets up a Socket.IO server that authenticates users based on JWT tokens.
// puts each connected user in a room named after their role and ID (e.g., "user:123" or "provider:456").
// It also provides a function to emit chat messages to the appropriate rooms based on sender and receiver IDs.

// socket.io is a library that enables real-time, bidirectional communication between web clients and servers. 
// It consists of a server-side library for Node.js and a client-side library for browsers. Socket.IO abstracts away the complexities of real-time communication, providing a simple API for sending and receiving messages in real time. 
// It supports various transport mechanisms (WebSocket, long polling, etc.) and automatically falls back to the best available transport method based on the client's capabilities. 
// Socket.IO is commonly used for applications like chat apps, live notifications, real-time analytics, and collaborative tools where low latency and instant updates are crucial.
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { JWT_SECRET } from "../config";
import type { ChatMessageDto } from "../repositories/chat/chat.repository";

type SocketRole = "user" | "provider"; // Define the possible roles for socket users.

interface SocketUser {  // Define the structure of the authenticated user information stored in the socket
    id: string;
    role: SocketRole;
}

let io: Server | null = null; // This variable will hold the Socket.IO server instance once it's initialized.

function extractToken(socket: Socket): string | null { // This function attempts to extract a JWT token from the socket's handshake data, checking both the auth object and the headers.
    const authToken = socket.handshake.auth?.token; 
    // First, it checks if the token is provided in the auth object of the handshake. 
    // If it exists and is a non-empty string, it returns the token, removing any "Bearer " prefix if present.
    if (typeof authToken === "string" && authToken.trim().length > 0) {
        return authToken.startsWith("Bearer ")
            ? authToken.slice("Bearer ".length).trim()
            : authToken.trim();
    } // If the token is not found in the auth object, it then checks the Authorization header. If the header exists and starts with "Bearer ", it extracts and returns the token from the header.

    const headerValue = socket.handshake.headers.authorization;
    if (typeof headerValue === "string" && headerValue.startsWith("Bearer ")) {
        return headerValue.slice("Bearer ".length).trim();
    } 
        // If no valid token is found in either location, the function returns null, indicating that the user is not authenticated.
    return null;
}

function isObjectId(value: unknown): value is string {
    return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value); // Simple check for MongoDB ObjectId format (24 hex characters)
}

function parseUserFromToken(token: string): SocketUser | null { 
    // This function takes a JWT token as input and attempts to verify and decode it using the JWT_SECRET. 
    // If the token is valid, it extracts the user ID and role from the decoded token payload. 
    // It checks if the ID is a valid MongoDB ObjectId and if the role is either "user" or "provider". 
    // If all checks pass, it returns an object containing the user's ID and role. 
    // If any check fails (e.g., invalid token, missing fields, invalid format), it returns null, indicating that the user could not be authenticated.
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
// This function generates a room name for a given user based on their role and ID. 
// The room name is in the format "role:id" (e.g., "user:123" or "provider:456"). 
// This allows the server to easily target messages to specific users by sending messages to their respective rooms.

export function initSocketServer(httpServer: HttpServer): Server { 
    // This function initializes the Socket.IO server using the provided HTTP server. 
    // It sets up CORS options to allow cross-origin requests and specifies the transport methods (WebSocket and polling). 
    // It also defines middleware to authenticate incoming socket connections by extracting and verifying JWT tokens. 
    // If authentication is successful, it stores the authenticated user information in the socket's data and allows the connection to proceed. 
    // If authentication fails, it rejects the connection with an "Unauthorized" error. 
    // Finally, it listens for new connections and adds authenticated users to their respective rooms based on their role and ID.
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
    // This function is responsible for emitting a chat message to the appropriate rooms based on the sender and receiver IDs. 
    // It checks if the Socket.IO server instance (io) is initialized. If it is not, the function simply returns without doing anything. 
    // If the server instance is available, it emits a "chat:message" event to both the sender's room and the receiver's room. 
    // The rooms are determined by the sender and receiver IDs, prefixed with their respective roles ("user" or "provider"). 
    // This allows both the sender and receiver to receive the chat message in real time if they are connected to the Socket.IO server.
    if (!io) return;

    io.to(`user:${message.senderId}`)
        .to(`provider:${message.senderId}`)
        .emit("chat:message", message);

    io.to(`user:${message.receiverId}`)
        .to(`provider:${message.receiverId}`)
        .emit("chat:message", message);
}



