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
}
