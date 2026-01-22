import { AuthService } from "@/services/authService";
import { api } from "@/api/api";
import { AxiosResponse } from "axios";

jest.mock("@/api/api", () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("AuthService", () => {
  const service = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getUserByGoogle envía token y retorna data", async () => {
    mockedApi.post.mockResolvedValueOnce(
      {
        data: { user: "test" },
      } as unknown as AxiosResponse<{ user: string }>
    );

    const res = await service.getUserByGoogle({ token: "123" });

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/auth/google",
      { token: "123" }
    );

    expect(res).toEqual({ user: "test" });
  });

  it("loginAdmin envía email y password", async () => {
    mockedApi.post.mockResolvedValueOnce(
      {
        data: { token: "xyz" },
      } as unknown as AxiosResponse<{ token: string }>
    );

    const res = await service.loginAdmin({
      email: "correo@example.com",
      password: "123456",
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/auth/admin/login",
      { email: "correo@example.com", password: "123456" }
    );

    expect(res.token).toBe("xyz");
  });

  it("refreshToken envía refreshToken", async () => {
    mockedApi.post.mockResolvedValueOnce(
      {
        data: { access: "newToken" },
      } as unknown as AxiosResponse<{ access: string }>
    );

    const res = await service.refreshToken("refresh123");

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/auth/refresh",
      { refreshToken: "refresh123" }
    );

    expect(res.access).toBe("newToken");
  });

  it("persist obtiene datos del endpoint", async () => {
    mockedApi.get.mockResolvedValueOnce(
      {
        data: { user: "persistUser" },
      } as unknown as AxiosResponse<{ user: string }>
    );

    const res = await service.persist();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/auth/persist");
    expect(res).toEqual({ user: "persistUser" });
  });

  it("logout llama al endpoint de logout", async () => {
    mockedApi.post.mockResolvedValueOnce({} as AxiosResponse);

    await service.logout();

    expect(mockedApi.post).toHaveBeenCalledWith("/api/auth/logout");
  });
});
