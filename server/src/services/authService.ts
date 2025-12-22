import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwtPayload";
import { env } from "../config/env";

export class AuthService {
  constructor(private userRepository: any) { }

  async findOrCreateUser(googleUser: { name: string; email: string; picture?: string }) {
    const USER_ROLE_ID = 2;
    const DEFAULT_PICTURE =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    let user = await this.userRepository.findByEmail(googleUser.email);
    let isNew = false;

    if (!user) {
      user = await this.userRepository.createUser({
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture || DEFAULT_PICTURE,
        roleId: USER_ROLE_ID,
      });
      isNew = true;
    }

    return { user, isNew };
  }


  async getUserById(id: number) {
    return this.userRepository.findById(id);
  }

  async getUserByToken(token: string) {
    const decoded = this.verifyToken(token);
    return this.userRepository.findById(decoded.id);
  }

  private verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new Error("Token inválido o expirado");
    }
  }

  async verifyRefreshToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, env.JWT_REFRESH_SECRET);
      return true;
    } catch {
      return false;
    }
  }
}
