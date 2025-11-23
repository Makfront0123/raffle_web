import { AppDataSource } from '../data-source';
import { Provider } from '../entities/provider.entity';
import { Prize } from '../entities/prize.entity';
export class ProviderService {
  private providerRepo = AppDataSource.getRepository(Provider);
  private prizeRepo = AppDataSource.getRepository(Prize);

  async getAllProviders() {
    return this.providerRepo.find({ relations: ["prizes"] });
  }

  async getProviderById(id: number) {
    return this.providerRepo.findOne({ where: { id } });
  }

  async createProvider(data: Partial<Provider>) {
    if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
      throw new Error("El nombre del proveedor es obligatorio");
    }

    const provider = this.providerRepo.create({
      name: data.name.trim(),
      contact_name: data.contact_name?.trim() ?? "",
      contact_email: data.contact_email?.trim() ?? "",
      contact_phone: data.contact_phone?.trim() ?? "",
    });

    const saved = await this.providerRepo.save(provider);
    return {
      message: "Proveedor creado correctamente",
      data: saved,
    };
  }

  async updateProvider(id: number, data: Partial<Provider>) {
    const payload: Partial<Provider> = {};

    if (typeof data.name === "string" && data.name.trim() !== "") {
      payload.name = data.name.trim();
    }
    if (typeof data.contact_name === "string") {
      payload.contact_name = data.contact_name.trim();
    }
    if (typeof data.contact_email === "string") {
      payload.contact_email = data.contact_email.trim();
    }
    if (typeof data.contact_phone === "string") {
      payload.contact_phone = data.contact_phone.trim();
    }

    if (Object.keys(payload).length === 0) {
      throw new Error("No se enviaron campos válidos para actualizar");
    }

    await this.providerRepo.update(id, payload);

    return {
      message: "Proveedor actualizado correctamente",
      data: await this.providerRepo.findOne({ where: { id } }),
    };
  }

  async deleteProvider(id: number) {
    const provider = await this.providerRepo.findOne({ where: { id } });
    if (!provider) throw new Error("Proveedor no encontrado");

    const prizes = await this.prizeRepo
      .createQueryBuilder("prize")
      .leftJoin("prize.provider", "provider")
      .where("provider.id = :id", { id })
      .getMany();

    if (prizes.length > 0) {
      throw new Error("No se puede eliminar el proveedor porque tiene premios asociados");
    }

    try {
      await this.providerRepo.delete(id);
      return { message: `Proveedor #${id} eliminado correctamente` };
    } catch (error: any) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        throw new Error("No se puede eliminar el proveedor porque tiene premios asociados");
      }
      throw error;
    }
  }
}
