import z from 'zod';
import { ProviderSchema } from '../../types/provider/provider.type';

const ProviderLocationDTO = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
});

export const CreateProviderDTO = ProviderSchema.pick({
    businessName: true,
    address: true,
    phone: true,
    providerType: true,
    
}
).extend({
    email: z.string().email().trim(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    location: ProviderLocationDTO.optional(),
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
