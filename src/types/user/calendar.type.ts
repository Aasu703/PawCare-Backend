import z from "zod";

export const CalendarDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const CalendarMonthSchema = z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format");

export const CalendarTodoSchema = z.object({
    id: z.string().optional(),
    text: z.string().min(1).max(300),
    done: z.boolean().default(false),
});

export const CalendarEntrySchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    date: CalendarDateSchema,
    notes: z.string().max(2000).optional(),
    todos: z.array(CalendarTodoSchema).max(100).default([]),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type CalendarEntryType = z.infer<typeof CalendarEntrySchema>;
export type CalendarTodoType = z.infer<typeof CalendarTodoSchema>;
