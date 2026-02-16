import { PostModel, IPost } from "../../models/provider/post.model";
import { CreatePostDto, UpdatePostDto } from "../../dtos/provider/post.dto";

export class PostRepository {
    async createPost(data: CreatePostDto & { providerId: string; providerName?: string }): Promise<IPost> {
        return PostModel.create(data);
    }

    async getPostById(id: string): Promise<IPost | null> {
        return PostModel.findById(id).exec();
    }

    async getPostsByProvider(providerId: string): Promise<IPost[]> {
        return PostModel.find({ providerId }).sort({ createdAt: -1 }).exec();
    }

    async getAllPublicPosts(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            PostModel.find({ isPublic: true }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            PostModel.countDocuments({ isPublic: true }).exec(),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getAllPosts(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            PostModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            PostModel.countDocuments().exec(),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async updatePostById(id: string, updates: UpdatePostDto): Promise<IPost | null> {
        return PostModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deletePostById(id: string): Promise<IPost | null> {
        return PostModel.findByIdAndDelete(id).exec();
    }
}
