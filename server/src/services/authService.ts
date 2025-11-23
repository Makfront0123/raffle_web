import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { JwtPayload } from "../types/jwtPayload";
import { env } from "../config/env";
export class AuthService {
  async findOrCreateUser(googleUser: {
    name: string;
    email: string;
    picture?: string;
  }) {
    const USER_ROLE_ID = 2;
    let user = await userRepository.findByEmail(googleUser.email);
    let isNew = false;

    if (!user) {
      user = await userRepository.createUser({
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
        roleId: USER_ROLE_ID,
      });
      isNew = true;
    }

    return { user, isNew };
  }

  async getUserById(id: number) {
    return userRepository.findById(id);
  }


  async getUserByToken(token: string) {
    const decoded = this.verifyToken(token);
    return userRepository.findById(decoded.id);
  }

  private verifyToken(token: string): any {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload
    } catch (err) {
      throw new Error("Token inválido o expirado");
    }
  }

  async verifyRefreshToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, env.JWT_REFRESH_SECRET);
      return true;
    } catch (err) {
      return false;
    }
  }
}
