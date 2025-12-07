import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export class UserService {
    private userRepo;

    constructor(repo?: any) {
        this.userRepo = repo ?? AppDataSource.getRepository(User);
    }

    async getAllUsers() {
        const users = await this.userRepo.find({ relations: ["role"] });
        return { message: "Usuarios obtenidos correctamente", users };
    }

    async getUserById(id: number) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: ["role"],
        });

        if (!user) throw new Error("Usuario no encontrado");

        return { message: "Usuario obtenido correctamente", user };
    }

    async updateUser(id: number, data: Partial<User>) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new Error("Usuario no encontrado");

        Object.assign(user, data);
        await this.userRepo.save(user);

        return { message: "Usuario actualizado correctamente", user };
    }

    async deleteUser(id: number) {
        const result = await this.userRepo.delete(id);

        if (!result || result.affected === 0)
            throw new Error("Usuario no encontrado");

        return { message: `Usuario #${id} eliminado correctamente` };
    }
}
