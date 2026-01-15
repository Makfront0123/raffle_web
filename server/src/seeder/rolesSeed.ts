import { AppDataSource } from "../data-source";
import { Role } from "../entities/role.entity";

export async function seedRoles() {
    const roleRepo = AppDataSource.getRepository(Role);

    const roles = [
        { id: 1, name: "admin" },
        { id: 2, name: "user" },
    ];

    for (const role of roles) {
        await roleRepo.upsert(role, ["id"]);
    }
    console.log("Roles seeded");
}
