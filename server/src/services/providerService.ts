import { AppDataSource } from '../data-source';
import { Provider } from '../entities/provider.entity';
import { Prize } from '../entities/prize.entity';

export class ProviderService {
  private providerRepo = AppDataSource.getRepository(Provider);
  private prizeRepo = AppDataSource.getRepository(Prize);

  async getAllProviders() {
    return this.providerRepo.find({ relations: ['prizes'] });
  }

  async getProviderById(id: number) {
    return this.providerRepo.findOne({ where: { id } });
  }

  async createProvider(data: Partial<Provider>) {
    const provider = this.providerRepo.create(data);
    const saved = await this.providerRepo.save(provider);
    return {
      message: 'Proveedor creado correctamente',
      data: saved
    }
  }

  async updateProvider(id: number, data: Partial<Provider>) {
    await this.providerRepo.update(id, data);
    return {
      message: 'Proveedor actualizado correctamente',
      data: await this.providerRepo.findOne({ where: { id } })
    }
  }

  async deleteProvider(id: number) {
    const provider = await this.providerRepo.findOne({ where: { id } });
    if (!provider) throw new Error('Proveedor no encontrado');
    const prizes = await this.prizeRepo
      .createQueryBuilder('prize')
      .leftJoin('prize.provider', 'provider')
      .where('provider.id = :id', { id })
      .getMany();

    if (prizes.length > 0) {
      throw new Error('No se puede eliminar el proveedor porque tiene premios asociados');
    }

    try {
      await this.providerRepo.delete(id);
      return { message: `Proveedor #${id} eliminado correctamente` };
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new Error('No se puede eliminar el proveedor porque tiene premios asociados');
      }
      throw error;
    }

  }
}
