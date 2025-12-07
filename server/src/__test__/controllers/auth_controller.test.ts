import { AuthController } from "../../controllers/authController";
import jwt from "jsonwebtoken";
import axios from "axios";

jest.mock("axios");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const mockRequest = (data: any = {}) => ({ ...data }) as any;

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};


const mockUserRepo = {
  findById: jest.fn(),
  findOneBy: jest.fn(),
};


const mockAuthService = {
  findOrCreateUser: jest.fn(),
  getUserByToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
  getUserById: jest.fn(),
};

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(mockAuthService as any, mockUserRepo as any);
  });

 
 

  test("loginWithGoogle retorna datos del usuario y tokens", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        email: "test@test.com",
        name: "Test User",
        picture: "img.png",
      },
    });

    mockAuthService.findOrCreateUser.mockResolvedValue({
      user: {
        id: 1,
        name: "Test User",
        email: "test@test.com",
        picture: "img.png",
        role: { id: 1, name: "user" },
      },
      isNew: false,
    });

    jwt.sign = jest.fn().mockReturnValue("FAKE_TOKEN");

    const req = mockRequest({ body: { token: "GOOGLE_TOKEN" } });
    const res = mockResponse();

    await controller.loginWithGoogle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("loginWithGoogle retorna error si falta el token", async () => {
    const req = mockRequest({ body: {} });
    const res = mockResponse();

    await controller.loginWithGoogle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Falta el token de Google",
    });
  });

  test("persistToken devuelve el usuario si el token es válido", async () => {
    mockAuthService.getUserByToken.mockResolvedValue({
      id: 1,
      name: "Test",
      email: "test@test.com",
      picture: null,
      role: { name: "user" },
    });

    const req = mockRequest({
      headers: { authorization: "Bearer FAKE_JWT" },
    });
    const res = mockResponse();

    await controller.persistToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("persistToken retorna 401 si no se envía token", async () => {
    const req = mockRequest({ headers: {} });
    const res = mockResponse();

    await controller.persistToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token no proporcionado",
    });
  });

  test("persistToken retorna 404 si el usuario no existe", async () => {
    mockAuthService.getUserByToken.mockResolvedValue(null);

    const req = mockRequest({
      headers: { authorization: "Bearer FAKE" },
    });
    const res = mockResponse();

    await controller.persistToken(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario no encontrado",
    });
  });

  test("refreshToken devuelve nuevo token si todo es válido", async () => {
    const req = mockRequest({ body: { refreshToken: "REFRESH123" } });
    const res = mockResponse();

    mockAuthService.verifyRefreshToken.mockResolvedValue(true);

    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    mockAuthService.getUserById.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      role: { id: 1 },
    });

    jwt.sign = jest.fn().mockReturnValue("NEW_ACCESS_TOKEN");

    await controller.refreshToken(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: "NEW_ACCESS_TOKEN" });
  });

  test("refreshToken retorna 400 si no se envía token", async () => {
    const req = mockRequest({ body: {} });
    const res = mockResponse();

    await controller.refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Falta el refresh token",
    });
  });

  test("refreshToken retorna 401 si refresh token es inválido", async () => {
    mockAuthService.verifyRefreshToken.mockResolvedValue(false);

    const req = mockRequest({ body: { refreshToken: "X" } });
    const res = mockResponse();

    await controller.refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Refresh token inválido",
    });
  });
});
