import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

export class UserRepository {
  constructor(private repo: Repository<User>) {}

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      relations: ["role"],
    });
  }

  async createUser(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ["role"],
    });
  }

  async findByIdAndUpdate(id: number, data: Partial<User>) {
    await this.repo.update(id, data);
    return this.findById(id); // <- ahora devuelve el usuario actualizado
  }

  async update(id: number, data: Partial<User>) {
    // Opción simple si no necesitas devolver nada
    return this.repo.update(id, data);
  }

  async save(user: User) {
    return this.repo.save(user);
  }

  async findByIdAndDelete(id: number) {
    return this.repo.delete(id);
  }
}
