import { CreatePostDto, UpdatePostDto } from "../../dtos/provider/post.dto";
import { PostRepository } from "../../repositories/provider/post.repository";
import { HttpError } from "../../errors/http-error";

const postRepository = new PostRepository();

interface GetAllPublicPostsResult {
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class PostService {
    async createPost(data: CreatePostDto, providerId: string, providerName?: string) {
        return postRepository.createPost({ ...data, providerId, providerName });
    }

    async getPostById(id: string) {
        const post = await postRepository.getPostById(id);
        if (!post) throw new HttpError(404, "Post not found");
        return post;
    }

    async getPostsByProvider(providerId: string) {
        return postRepository.getPostsByProvider(providerId);
    }

    async getAllPublicPosts(page = 1, limit = 10): Promise<GetAllPublicPostsResult> {
        return postRepository.getAllPublicPosts(page, limit);
    }

    async getAllPosts(page = 1, limit = 10) {
        return postRepository.getAllPosts(page, limit);
    }

    async updatePost(id: string, providerId: string, data: UpdatePostDto) {
        return postRepository.updatePostById(id, data);
    }

    async deletePost(id: string) {
        return postRepository.deletePostById(id);
    }

    async deletePostForProvider(id: string, providerId: string) {
        return postRepository.deletePostById(id);
    }
}
