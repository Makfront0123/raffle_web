import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";
import { roleRepository } from "./roleRepository";
export class UserRepository {
  constructor(
    private repo: Repository<User>,
    private roleRepo: typeof roleRepository
  ) { }


  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      relations: ["role"],
    });
  }
  async existsAdmin(email?: string) {
    const whereClause: any = { role: { name: "admin" } };
    if (email) whereClause.email = email;

    return (await this.repo.count({
      where: whereClause,
      relations: ["role"],
    })) > 0;
  }


  async createAdmin(data: { email: string; password: string; name?: string }) {
    const { email, password, name } = data;


    const hashedPassword = await bcrypt.hash(password, 10);

    const adminRole = await this.roleRepo.findByName("admin");
    if (!adminRole) throw new Error("Admin role not found");
    const user = this.repo.create({
      email,
      password: hashedPassword,
      role: adminRole,
      roleId: adminRole.id,
      name: name || "Administrador",
    });

    return this.repo.save(user);
  }

  async comparePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }


  async findAdminByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
      relations: ['role'],
      select: ['id', 'email', 'name', 'password', 'role', 'roleId'] // <-- importante incluir password
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
    return this.findById(id);
  }

  async update(id: number, data: Partial<User>) {
    return this.repo.update(id, data);
  }

  async save(user: User) {
    return this.repo.save(user);
  }

  async findByIdAndDelete(id: number) {
    return this.repo.delete(id);
  }
}
