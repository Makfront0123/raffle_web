import { AppDataSource } from "../data-source";
import { Role } from "../entities/role.entity";

export async function seedRoles() {
    const roleRepo = AppDataSource.getRepository(Role);

    const roles = [
        { id: 1, name: "admin" },
        { id: 2, name: "user" },
    ];

    for (const role of roles) {
        const exists = await roleRepo.findOneBy({ id: role.id });
        if (!exists) {
            await roleRepo.save(role);
            console.log(`Role ${role.name} created`);
        }
    }
    console.log("Roles seeded");
}
