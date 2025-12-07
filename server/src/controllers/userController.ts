import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  private userService: UserService;

  constructor(userService = new UserService()) {
    this.userService = userService;
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo usuarios", error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(Number(req.params.id));
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo usuario", error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userService.updateUser(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error actualizando usuario", error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await this.userService.deleteUser(Number(req.params.id));
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error eliminando usuario", error });
    }
  }
}
