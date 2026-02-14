import { CreateInventoryDto, UpdateInventoryDto } from "../../dtos/provider/inventory.dto";
import { HttpError } from "../../errors/http-error";
import { InventoryRepository } from "../../repositories/provider/inventory.repository";

const inventoryRepository = new InventoryRepository();

export class InventoryService {
    async createInventory(data: CreateInventoryDto) {
        if (!data.providerId) {
            throw new HttpError(400, "Provider ID is required");
        }
        return inventoryRepository.createInventory(data);
    }

    async getInventoryById(id: string) {
        const item = await inventoryRepository.getInventoryById(id);
        if (!item) {
            throw new HttpError(404, "Inventory item not found");
        }
        return item;
    }

    async getInventoryByProviderId(providerId: string) {
        return inventoryRepository.getInventoryByProviderId(providerId);
    }

    async getAllInventory(page: number = 1, limit: number = 10) {
        return inventoryRepository.getAllInventory(page, limit);
    }

    async updateInventory(id: string, data: UpdateInventoryDto) {
        const updated = await inventoryRepository.updateInventoryById(id, data);
        if (!updated) {
            throw new HttpError(404, "Inventory item not found");
        }
        return updated;
    }

    async deleteInventory(id: string) {
        const deleted = await inventoryRepository.deleteInventoryById(id);
        if (!deleted) {
            throw new HttpError(404, "Inventory item not found");
        }
        return deleted;
    }

    // Provider-scoped operations
    async updateInventoryForProvider(providerId: string, id: string, data: UpdateInventoryDto) {
        const existing = await inventoryRepository.getInventoryById(id);
        if (!existing) throw new HttpError(404, "Inventory item not found");
        if (existing.providerId?.toString() !== providerId.toString()) {
            throw new HttpError(403, "Forbidden: not your inventory");
        }
        return inventoryRepository.updateInventoryById(id, data);
    }

    async deleteInventoryForProvider(providerId: string, id: string) {
        const existing = await inventoryRepository.getInventoryById(id);
        if (!existing) throw new HttpError(404, "Inventory item not found");
        if (existing.providerId?.toString() !== providerId.toString()) {
            throw new HttpError(403, "Forbidden: not your inventory");
        }
        return inventoryRepository.deleteInventoryById(id);
    }
}
