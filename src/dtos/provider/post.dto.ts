import z from "zod";
import { PostSchema } from "../../types/provider/post.type";

export const CreatePostDto = PostSchema.pick({
    title: true,
    content: true,
});
export type CreatePostDto = z.infer<typeof CreatePostDto>;

export const UpdatePostDto = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    isPublic: z.boolean().optional(),
});
export type UpdatePostDto = z.infer<typeof UpdatePostDto>;
