import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";

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

  async getUserByToken(token: string) {
    const decoded = this.verifyToken(token);
    return userRepository.findById(decoded.id);
  }

  private verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      throw new Error("Token inválido o expirado");
    }
  }
}
