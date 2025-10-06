import { Request, Response } from "express";
import { UserService } from "../services/userService";
 

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error obteniendo usuarios", error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(Number(req.params.id));
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error obteniendo usuario", error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await userService.updateUser(Number(req.params.id), req.body);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error actualizando usuario", error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await userService.deleteUser(Number(req.params.id));
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error eliminando usuario", error });
    }
  }
}
