import { ServiceModel, IService } from "../../models/provider/service.model";
import { ServiceType } from "../../types/provider/service.type";

export class ServiceRepository {
  async createService(data: ServiceType): Promise<IService> {
    return ServiceModel.create(data);
  }

  async getServiceById(id: string): Promise<IService | null> {
    return ServiceModel.findById(id).exec();
  }

  async getAllServices(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [services, total] = await Promise.all([
      ServiceModel.find().skip(skip).limit(limit).exec(),
      ServiceModel.countDocuments().exec(),
    ]);
    return { services, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateServiceById(id: string, updates: Partial<ServiceType>): Promise<IService | null> {
    return ServiceModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async deleteServiceById(id: string): Promise<IService | null> {
    return ServiceModel.findByIdAndDelete(id).exec();
  }
}

export default ServiceRepository;
