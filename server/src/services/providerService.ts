
import { AppDataSource } from '../data-source';
import { Provider } from '../entities/provider.entity';

export class ProviderService {
  private providerRepo = AppDataSource.getRepository(Provider);

  async getAllProviders() {
    return this.providerRepo.find({ relations: ['prizes'] });
  }

  async getProviderById(id: number) {
    return this.providerRepo.findOne({ where: { id } });
  }

  async createProvider(data: Partial<Provider>) {
    const provider = this.providerRepo.create(data);
    return this.providerRepo.save(provider);
  }

  async updateProvider(id: number, data: Partial<Provider>) {
    await this.providerRepo.update(id, data);
    return this.getProviderById(id);
  }

  async deleteProvider(id: number) {
    const provider = await this.providerRepo.findOne({ where: { id } });
    if (!provider) throw new Error('Proveedor no encontrado');
    await this.providerRepo.delete(id);
  }

}
