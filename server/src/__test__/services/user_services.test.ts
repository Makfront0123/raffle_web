import { UserService } from "../../services/userService";

describe("UserService", () => {

    let fakeUserRepo: any;
    let service: UserService;

    beforeEach(() => {
        fakeUserRepo = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        };

        service = new UserService(fakeUserRepo);
    });


    test("getAllUsers devuelve lista de usuarios", async () => {
        const mockUsers = [
            { id: 1, name: "Juan", role: { id: 1, name: "admin" } },
            { id: 2, name: "Ana", role: { id: 2, name: "user" } }
        ];

        fakeUserRepo.find.mockResolvedValue(mockUsers);

        const res = await service.getAllUsers();

        expect(fakeUserRepo.find).toHaveBeenCalledWith({
            relations: ["role"],
        });

        expect(res).toEqual({
            message: "Usuarios obtenidos correctamente",
            users: mockUsers,
        });
    });

    test("getUserById devuelve un usuario", async () => {
        const mockUser = { id: 10, name: "Pepe", role: { id: 1 } };

        fakeUserRepo.findOne.mockResolvedValue(mockUser);

        const res = await service.getUserById(10);

        expect(fakeUserRepo.findOne).toHaveBeenCalledWith({
            where: { id: 10 },
            relations: ["role"],
        });

        expect(res.user).toEqual(mockUser);
    });

    test("getUserById lanza error si no existe", async () => {
        fakeUserRepo.findOne.mockResolvedValue(null);

        await expect(service.getUserById(5)).rejects.toThrow("Usuario no encontrado");
    });

    test("updateUser actualiza un usuario", async () => {
        const existing = { id: 3, name: "Luis", age: 25 };
        const updatedData = { name: "Luis Updated" };

        fakeUserRepo.findOne.mockResolvedValue(existing);
        fakeUserRepo.save.mockResolvedValue({ ...existing, ...updatedData });

        const res = await service.updateUser(3, updatedData);

        expect(fakeUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 3 } });
        expect(fakeUserRepo.save).toHaveBeenCalled();

        expect(res.user.name).toBe("Luis Updated");
    });

    test("updateUser falla si no existe", async () => {
        fakeUserRepo.findOne.mockResolvedValue(null);

        await expect(service.updateUser(1, {}))
            .rejects
            .toThrow("Usuario no encontrado");
    });


    test("deleteUser elimina un usuario correctamente", async () => {
        fakeUserRepo.delete.mockResolvedValue({ affected: 1 });

        const res = await service.deleteUser(5);

        expect(fakeUserRepo.delete).toHaveBeenCalledWith(5);
        expect(res.message).toBe("Usuario #5 eliminado correctamente");
    });

    test("deleteUser falla si no existe", async () => {
        fakeUserRepo.delete.mockResolvedValue({ affected: 0 });

        await expect(service.deleteUser(99)).rejects.toThrow("Usuario no encontrado");
    });

});
