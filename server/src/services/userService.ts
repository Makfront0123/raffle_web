 
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async getAllUsers() {
    return await this.userRepo.find({
      relations: ["role"], // si quieres incluir el rol
    });
  }

  async getUserById(id: number) {
    return await this.userRepo.findOne({
      where: { id },
      relations: ["role"],
    });
  }

  async updateUser(id: number, data: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new Error("Usuario no encontrado");

    Object.assign(user, data);
    return await this.userRepo.save(user);
  }

  async deleteUser(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new Error("Usuario no encontrado");
  }
}
