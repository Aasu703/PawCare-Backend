import { Request, Response } from "express";
import { PostService } from "../../services/provider/post.service";
import { CreatePostDto, UpdatePostDto } from "../../dtos/provider/post.dto";
import z from "zod";

const postService = new PostService();

export class PostController {
    // Provider creates a post
    async create(req: Request, res: Response) {
        try {
            const provider = (req as any).provider;
            if (!provider) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = CreatePostDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }

            const post = await postService.createPost(
                parsed.data,
                provider._id.toString(),
                provider.businessName
            );
            return res.status(201).json({ success: true, message: "Post created", data: post });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    // Provider's own posts
    async getMyPosts(req: Request, res: Response) {
        try {
            const provider = (req as any).provider;
            if (!provider) return res.status(401).json({ success: false, message: "Unauthorized" });

            const posts = await postService.getPostsByProvider(provider._id.toString());
            return res.status(200).json({ success: true, data: posts });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    // Public - get all public posts
    async getPublicPosts(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await postService.getAllPublicPosts(page, limit);
            return res.status(200).json({
                success: true,
                data: {
                    posts: result.items,
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                },
            });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    // Get posts by provider (public)
    async getByProvider(req: Request, res: Response) {
        try {
            const posts = await postService.getPostsByProvider(req.params.providerId);
            return res.status(200).json({ success: true, data: posts });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const post = await postService.getPostById(req.params.id);
            return res.status(200).json({ success: true, data: post });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    // Provider updates their post
    async update(req: Request, res: Response) {
        try {
            const provider = (req as any).provider;
            if (!provider) return res.status(401).json({ success: false, message: "Unauthorized" });

            const parsed = UpdatePostDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
            }

            const post = await postService.updatePost(req.params.id, provider._id.toString(), parsed.data);
            return res.status(200).json({ success: true, message: "Post updated", data: post });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    // Provider deletes their post
    async remove(req: Request, res: Response) {
        try {
            const provider = (req as any).provider;
            if (!provider) return res.status(401).json({ success: false, message: "Unauthorized" });

            await postService.deletePostForProvider(req.params.id, provider._id.toString());
            return res.status(200).json({ success: true, message: "Post deleted" });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    // Admin: list all posts
    async listAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await postService.getAllPosts(page, limit);
            return res.status(200).json({
                success: true,
                data: {
                    posts: result.items,
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                },
            });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }

    // Admin: delete any post
    async adminDelete(req: Request, res: Response) {
        try {
            await postService.deletePost(req.params.id);
            return res.status(200).json({ success: true, message: "Post deleted" });
        } catch (err: any) {
            return res.status(err.statusCode ?? 500).json({ success: false, message: err.message || "Internal Server Error" });
        }
    }
}

export default new PostController();
