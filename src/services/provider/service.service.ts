import { ServiceRepository } from "../../repositories/provider/service.repository";
import { ServiceType } from "../../types/provider/service.type";
import { HttpError } from "../../errors/http-error";

export class ServiceService {
  constructor(private serviceRepository = new ServiceRepository()) {}

  async createService(data: ServiceType) {
    return this.serviceRepository.createService(data);
  }

  async getServiceById(id: string) {
    const service = await this.serviceRepository.getServiceById(id);
    if (!service) throw new HttpError(404, "Service not found");
    return service;
  }

  async getAllServices(page = 1, limit = 20) {
    return this.serviceRepository.getAllServices(page, limit);
  }

  async getServicesByProviderId(providerId: string, page = 1, limit = 20) {
    return this.serviceRepository.getServicesByProviderId(providerId, page, limit);
  }

  async updateService(id: string, updates: Partial<ServiceType>) {
    const updated = await this.serviceRepository.updateServiceById(id, updates);
    if (!updated) throw new HttpError(404, "Service not found");
    return updated;
  }

  async deleteService(id: string) {
    const deleted = await this.serviceRepository.deleteServiceById(id);
    if (!deleted) throw new HttpError(404, "Service not found");
    return deleted;
  }

  // Provider-scoped operations: ensure service belongs to provider
  async updateServiceForProvider(providerId: string, id: string, updates: Partial<ServiceType>) {
    const existing = await this.serviceRepository.getServiceById(id);
    if (!existing) throw new HttpError(404, "Service not found");
    if ((existing as any).providerId?.toString() !== providerId.toString()) {
      throw new HttpError(403, "Forbidden: not your service");
    }
    return this.serviceRepository.updateServiceById(id, updates);
  }

  async deleteServiceForProvider(providerId: string, id: string) {
    const existing = await this.serviceRepository.getServiceById(id);
    if (!existing) throw new HttpError(404, "Service not found");
    if ((existing as any).providerId?.toString() !== providerId.toString()) {
      throw new HttpError(403, "Forbidden: not your service");
    }
    return this.serviceRepository.deleteServiceById(id);
  }
}

export default new ServiceService();
