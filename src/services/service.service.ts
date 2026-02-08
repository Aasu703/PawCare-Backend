import { ServiceRepository } from "../repositories/service.repository";
import { ServiceType } from "../types/service.type";

const serviceRepository = new ServiceRepository();

export class ServiceService {
  async createService(data: ServiceType) {
    return serviceRepository.createService(data);
  }

  async getServiceById(id: string) {
    const service = await serviceRepository.getServiceById(id);
    return service;
  }

  async getAllServices(page = 1, limit = 20) {
    return serviceRepository.getAllServices(page, limit);
  }

  async updateService(id: string, updates: Partial<ServiceType>) {
    const updated = await serviceRepository.updateServiceById(id, updates);
    return updated;
  }

  async deleteService(id: string) {
    const deleted = await serviceRepository.deleteServiceById(id);
    return deleted;
  }

  // Provider-scoped operations: ensure service belongs to provider
  async updateServiceForProvider(providerId: string, id: string, updates: Partial<ServiceType>) {
    const existing = await serviceRepository.getServiceById(id);
    if (!existing) throw { status: 404, message: 'Service not found' };
    if ((existing as any).providerId?.toString() !== providerId.toString()) {
      throw { status: 403, message: 'Forbidden: not your service' };
    }
    return serviceRepository.updateServiceById(id, updates);
  }

  async deleteServiceForProvider(providerId: string, id: string) {
    const existing = await serviceRepository.getServiceById(id);
    if (!existing) throw { status: 404, message: 'Service not found' };
    if ((existing as any).providerId?.toString() !== providerId.toString()) {
      throw { status: 403, message: 'Forbidden: not your service' };
    }
    return serviceRepository.deleteServiceById(id);
  }
}

export default new ServiceService();
