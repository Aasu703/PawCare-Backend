import z from "zod";
import { ProviderServiceSchema } from "../../types/provider/provider-service.type";

export const ApplyProviderServiceDto = ProviderServiceSchema.pick({
    serviceType: true,
    registrationNumber: true,
    bio: true,
    experience: true,
}).extend({
    documents: z.union([z.array(z.string()), z.string()]).optional(),
});

export type ApplyProviderServiceDto = z.infer<typeof ApplyProviderServiceDto>;

export const UpdateProviderServiceStatusDto = z.object({
    verificationStatus: z.enum(["pending", "approved", "rejected"]),
});

export type UpdateProviderServiceStatusDto = z.infer<typeof UpdateProviderServiceStatusDto>;
