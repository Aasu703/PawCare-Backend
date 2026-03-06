import { CreatePostDto, UpdatePostDto } from "../../dtos/provider/post.dto";
import { PostRepository } from "../../repositories/provider/post.repository";
import { HttpError } from "../../errors/http-error";

interface GetAllPublicPostsResult {
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class PostService {
    constructor(private postRepository = new PostRepository()) {}

    async createPost(data: CreatePostDto, providerId: string, providerName?: string) {
        return this.postRepository.createPost({ ...data, providerId, providerName });
    }

    async getPostById(id: string) {
        const post = await this.postRepository.getPostById(id);
        if (!post) throw new HttpError(404, "Post not found");
        return post;
    }

    async getPostsByProvider(providerId: string) {
        return this.postRepository.getPostsByProvider(providerId);
    }

    async getAllPublicPosts(page = 1, limit = 10): Promise<GetAllPublicPostsResult> {
        return this.postRepository.getAllPublicPosts(page, limit);
    }

    async getAllPosts(page = 1, limit = 10) {
        return this.postRepository.getAllPosts(page, limit);
    }

    async updatePost(id: string, providerId: string, data: UpdatePostDto) {
        return this.postRepository.updatePostById(id, data);
    }

    async deletePost(id: string) {
        return this.postRepository.deletePostById(id);
    }

    async deletePostForProvider(id: string, providerId: string) {
        return this.postRepository.deletePostById(id);
    }
}
