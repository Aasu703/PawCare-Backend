import { Model, Document } from "mongoose";

/**
 * Generic base repository that encapsulates common Mongoose CRUD operations.
 * Concrete repositories extend this class and pass their Model + Document type.
 *
 * @example
 * export class PetRepository extends BaseRepository<IPet> {
 *     constructor() { super(PetModel); }
 * }
 */
export class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) {}

    async create(data: Record<string, unknown>): Promise<T> {
        return this.model.create(data as any) as unknown as T;
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findOne(filter: Record<string, unknown>): Promise<T | null> {
        return this.model.findOne(filter).exec();
    }

    async findMany(filter: Record<string, unknown> = {}): Promise<T[]> {
        return this.model.find(filter).exec() as unknown as T[];
    }

    async findPaginated(
        filter: Record<string, unknown> = {},
        page = 1,
        limit = 10,
        sort: Record<string, 1 | -1> = { createdAt: -1 }
    ) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.model.find(filter).sort(sort as any).skip(skip).limit(limit).exec(),
            this.model.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async updateById(id: string, updates: Record<string, unknown>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteById(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    async count(filter: Record<string, unknown> = {}): Promise<number> {
        return this.model.countDocuments(filter).exec();
    }
}
