import z from "zod";

export const UserSchema = z.object({
    Firstname: z.string().min(2),
    Lastname: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().min(10).optional(),
    role: z.enum(["user", "admin", "provider"]).default("user"),
    imageUrl: z.string().optional() // for image URL storage

});

export type UserType = z.infer<typeof UserSchema>;