import z from 'zod';
import { ProviderSchema } from '../../types/provider/provider.type';

export const CreateProviderDTO = ProviderSchema.pick({
    businessName: true,
    address: true,
    phone: true,
    
}
).extend({
    email: z.string().email().trim(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Please confirm the password",
        path: ["confirmPassword"]
    }
)
export type CreateProviderDTO = z.infer<typeof CreateProviderDTO>;
export const LoginProviderDTO = z.object({
    email: z.string().email().trim(),
    password: z.string().min(8)
});

export type LoginProviderDTO = z.infer<typeof LoginProviderDTO>;