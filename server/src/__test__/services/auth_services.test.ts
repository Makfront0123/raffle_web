
import jwt from "jsonwebtoken";
import { AuthService } from "../../services/authService";

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

const mockUserRepo = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    findById: jest.fn(),
};

const authService = new AuthService(mockUserRepo);

describe("AuthService", () => {
    let mockJwtVerify: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockJwtVerify = jwt.verify as unknown as jest.Mock;
    });

    test("crea un usuario si no existe", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        const mockCreatedUser = { id: 1, email: "test@mail.com" };
        mockUserRepo.createUser.mockResolvedValue(mockCreatedUser);

        const result = await authService.findOrCreateUser({
            name: "Test",
            email: "test@mail.com",
            picture: "img.png",
        });

        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("test@mail.com");
        expect(mockUserRepo.createUser).toHaveBeenCalled();
        expect(result).toEqual({ user: mockCreatedUser, isNew: true });
    });

    test("retorna usuario existente sin crearlo", async () => {
        const mockUser = { id: 2, email: "old@mail.com" };
        mockUserRepo.findByEmail.mockResolvedValue(mockUser);

        const result = await authService.findOrCreateUser({
            name: "Test",
            email: "old@mail.com",
        });

        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("old@mail.com");
        expect(mockUserRepo.createUser).not.toHaveBeenCalled();
        expect(result).toEqual({ user: mockUser, isNew: false });
    });


    test("getUserById retorna usuario", async () => {
        const mockUser = { id: 10 };
        mockUserRepo.findById.mockResolvedValue(mockUser);

        const result = await authService.getUserById(10);
        expect(result).toEqual(mockUser);
    });

 
    test("getUserByToken decodifica token y busca usuario", async () => {
        mockJwtVerify.mockReturnValue({ id: 99 });
        mockUserRepo.findById.mockResolvedValue({ id: 99 });

        const result = await authService.getUserByToken("fakeToken");

        expect(mockUserRepo.findById).toHaveBeenCalledWith(99);
        expect(result).toEqual({ id: 99 });
    });

    test("getUserByToken lanza error si token es inválido", async () => {
        mockJwtVerify.mockImplementation(() => {
            throw new Error("Invalid");
        });

        await expect(authService.getUserByToken("bad")).rejects.toThrow(
            "Token inválido o expirado"
        );
    });


    test("verifyRefreshToken retorna true si es válido", async () => {
        mockJwtVerify.mockReturnValue(true);
        const result = await authService.verifyRefreshToken("good");
        expect(result).toBe(true);
    });

    test("verifyRefreshToken retorna false si es inválido", async () => {
        mockJwtVerify.mockImplementation(() => {
            throw new Error("Invalid");
        });

        const result = await authService.verifyRefreshToken("bad");
        expect(result).toBe(false);
    });
});
