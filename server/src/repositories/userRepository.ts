import { db } from "../config/db";
import { User } from "../entities/user.entity";

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const [rows]: any = await db.query(
      `SELECT u.*, r.id AS roleId, r.name AS roleName
       FROM users u
       LEFT JOIN roles r ON u.roleId = r.id
       WHERE u.email = ?`,
      [email]
    );

    if (!rows.length) return null;

    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      picture: row.picture,
      role: { id: row.roleId, name: row.roleName },
      created_at: row.created_at,
    } as User;
  },

  async createUser(userData: {
    name: string;
    email: string;
    picture?: string;
    roleId: number;
  }): Promise<User> {
    const { name, email, picture, roleId } = userData;

    const [result]: any = await db.query(
      `INSERT INTO users (name, email, picture, roleId, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [name, email, picture || null, roleId]
    );

    const [roleRows]: any = await db.query(`SELECT * FROM roles WHERE id = ?`, [
      roleId,
    ]);
    const roleName = roleRows[0]?.name || "";

    return {
      id: result.insertId,
      name,
      email,
      picture: picture || null,
      role: { id: roleId, name: roleName },
      created_at: new Date(),
    } as User;
  },
};
