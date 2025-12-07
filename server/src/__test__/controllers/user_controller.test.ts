import { UserController } from "../../controllers/userController";

describe("UserController", () => {
  let controller: UserController;
  let mockService: any;
  let req: any;
  let res: any;

  beforeEach(() => {
    mockService = {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    controller = new UserController(mockService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  
  it("debe obtener todos los usuarios", async () => {
    const mockUsers = [{ id: 1 }, { id: 2 }];
    mockService.getAllUsers.mockResolvedValue(mockUsers);

    await controller.getAllUsers(req, res);

    expect(mockService.getAllUsers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

 
  it("debe obtener un usuario por ID", async () => {
    req = { params: { id: "3" } };
    const mockUser = { id: 3 };

    mockService.getUserById.mockResolvedValue(mockUser);

    await controller.getUserById(req, res);

    expect(mockService.getUserById).toHaveBeenCalledWith(3);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

 
  it("debe retornar 404 si el usuario no existe", async () => {
    req = { params: { id: "10" } };

    mockService.getUserById.mockResolvedValue(null);

    await controller.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuario no encontrado" });
  });

 
  it("debe actualizar un usuario", async () => {
    req = { params: { id: "5" }, body: { name: "Nuevo" } };

    const mockUpdated = { id: 5, name: "Nuevo" };
    mockService.updateUser.mockResolvedValue(mockUpdated);

    await controller.updateUser(req, res);

    expect(mockService.updateUser).toHaveBeenCalledWith(5, { name: "Nuevo" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdated);
  });
 
  it("debe eliminar un usuario", async () => {
    req = { params: { id: "9" } };

    mockService.deleteUser.mockResolvedValue(true);

    await controller.deleteUser(req, res);

    expect(mockService.deleteUser).toHaveBeenCalledWith(9);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario eliminado correctamente",
    });
  });

 
  it("debe retornar 500 si ocurre un error", async () => {
    mockService.getAllUsers.mockRejectedValue(new Error("DB error"));

    await controller.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error obteniendo usuarios" })
    );
  });
});
