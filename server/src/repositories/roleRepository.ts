
import { AppDataSource } from "../data-source";
import { Role } from "../entities/role.entity";

export const roleRepository = {
    async findByName(name: string): Promise<Role | null> {
        const [rows]: any = await AppDataSource.query('SELECT * FROM roles WHERE name = ?', [name]);
        if (!rows.length) return null;

        const row = rows[0];
        return {
            id: row.id,
            name: row.name,
            users: row.users,
        } as Role;
    }
    ,

    async createRole(roleData: {
        name: string;
    }): Promise<Role> {
        const { name } = roleData;

        const [result]: any = await AppDataSource.query(
            `INSERT INTO roles (name, created_at)
     VALUES (?, NOW())`,
            [name]
        );

        return {
            id: result.insertId,
            name,
            users: [],
        } as Role;
    }

};