import z from "zod";
import { id } from "zod/v4/locales";

export const BookingSchema = z.object({
    id: z.string().optional(),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
    price: z.coerce.number().nonnegative().optional(),
    notes: z.string().optional(),
    serviceId: z.string().optional(),
    userId: z.string().optional(),
    petId: z.string().optional(),
})

export type BookingType = z.infer<typeof BookingSchema>;