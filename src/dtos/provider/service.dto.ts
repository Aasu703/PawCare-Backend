import z from "zod";
import { ServiceSchema } from "../../types/provider/service.type";

export const CreateServiceDto = ServiceSchema.pick({
  title: true,
  description: true,
  price: true,
  duration_minutes: true,
  catergory: true,
  availability: true,
  providerId: true,
});

export type CreateServiceDto = z.infer<typeof CreateServiceDto>;

export const UpdateServiceDto = ServiceSchema.partial().omit({ id: true });
export type UpdateServiceDto = z.infer<typeof UpdateServiceDto>;
