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

  it("devLogin envía email", async () => {
    mockedApi.post.mockResolvedValueOnce(
      {
        data: { token: "xyz" },
      } as unknown as AxiosResponse<{ token: string }>
    );

    const res = await service.devLogin("correo@example.com");

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/auth/dev-login",
      { email: "correo@example.com" }
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
});
