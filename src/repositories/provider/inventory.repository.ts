import { InventoryModel, IInventory } from "../../models/provider/inventory.model";
import { CreateInventoryDto, UpdateInventoryDto } from "../../dtos/provider/inventory.dto";

export class InventoryRepository {
    async createInventory(data: CreateInventoryDto): Promise<IInventory> {
        return InventoryModel.create(data);
    }

    async getInventoryById(id: string): Promise<IInventory | null> {
        return InventoryModel.findById(id).exec();
    }

    async getInventoryByProviderId(providerId: string): Promise<IInventory[]> {
        return InventoryModel.find({ providerId }).exec();
    }

    async getAllInventory(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            InventoryModel.find().skip(skip).limit(limit).exec(),
            InventoryModel.countDocuments().exec()
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async updateInventoryById(id: string, updates: UpdateInventoryDto): Promise<IInventory | null> {
        return InventoryModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteInventoryById(id: string): Promise<IInventory | null> {
        return InventoryModel.findByIdAndDelete(id).exec();
    }
}
