import z from "zod";
import { UserSchema } from "../types/user.type";
export const CreateUserDTO = UserSchema.pick(
    {
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        phone: true
        
    }
) .extend(
    {
        confirmPassword: z.string().min(8)
    }
).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Please confirm the password",
        path: ["confirmPassword"]
    }
)

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
    email: z.email(),
    password: z.string().min(8)
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;