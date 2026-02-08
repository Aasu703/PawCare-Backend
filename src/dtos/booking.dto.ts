import z from "zod";
import { BookingSchema } from "../types/booking.type";

export const CreateBookingDto = BookingSchema.pick({
	startTime: true,
	endTime: true,
	serviceId: true,
	petId: true,
	notes: true
});

export type CreateBookingDto = z.infer<typeof CreateBookingDto>;

export const UpdateBookingDto = BookingSchema.partial().omit({ id: true, userId: true });
export type UpdateBookingDto = z.infer<typeof UpdateBookingDto>;