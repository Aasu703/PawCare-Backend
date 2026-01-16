import z from "zod";

export const UserSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().min(10),
    role: z.enum(["user", "admin", "provider"]).default("user"),

});

export type UserType = z.infer<typeof UserSchema>;