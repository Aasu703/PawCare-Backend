import { CreateInventoryDto, UpdateInventoryDto } from "../../dtos/provider/inventory.dto";
import { HttpError } from "../../errors/http-error";
import { InventoryRepository } from "../../repositories/provider/inventory.repository";

export class InventoryService {
    constructor(private inventoryRepository = new InventoryRepository()) {}

    async createInventory(data: CreateInventoryDto) {
        if (!data.providerId) {
            throw new HttpError(400, "Provider ID is required");
        }
        return this.inventoryRepository.createInventory(data);
    }

    async getInventoryById(id: string) {
        const item = await this.inventoryRepository.getInventoryById(id);
        if (!item) {
            throw new HttpError(404, "Inventory item not found");
        }
        return item;
    }

    async getInventoryByProviderId(providerId: string) {
        return this.inventoryRepository.getInventoryByProviderId(providerId);
    }

    async getAllInventory(page: number = 1, limit: number = 10) {
        return this.inventoryRepository.getAllInventory(page, limit);
    }

    async updateInventory(id: string, data: UpdateInventoryDto) {
        const updated = await this.inventoryRepository.updateInventoryById(id, data);
        if (!updated) {
            throw new HttpError(404, "Inventory item not found");
        }
        return updated;
    }

    async deleteInventory(id: string) {
        const deleted = await this.inventoryRepository.deleteInventoryById(id);
        if (!deleted) {
            throw new HttpError(404, "Inventory item not found");
        }
        return deleted;
    }

    // Provider-scoped operations
    async updateInventoryForProvider(providerId: string, id: string, data: UpdateInventoryDto) {
        const existing = await this.inventoryRepository.getInventoryById(id);
        if (!existing) throw new HttpError(404, "Inventory item not found");
        if (existing.providerId?.toString() !== providerId.toString()) {
            throw new HttpError(403, "Forbidden: not your inventory");
        }
        return this.inventoryRepository.updateInventoryById(id, data);
    }

    async deleteInventoryForProvider(providerId: string, id: string) {
        const existing = await this.inventoryRepository.getInventoryById(id);
        if (!existing) throw new HttpError(404, "Inventory item not found");
        if (existing.providerId?.toString() !== providerId.toString()) {
            throw new HttpError(403, "Forbidden: not your inventory");
        }
        return this.inventoryRepository.deleteInventoryById(id);
    }
}
