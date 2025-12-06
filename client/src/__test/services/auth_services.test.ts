import axios from "axios";
import { AuthService } from "@/services/authService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AuthService", () => {
  const service = new AuthService();

  it("getUserByGoogle envía token y retorna data", async () => {
    mockedAxios.post.mockResolvedValue({ data: { user: "test" } });

    const res = await service.getUserByGoogle({ token: "123" });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
      { token: "123" }
    );

    expect(res).toEqual({ user: "test" });
  });

  it("getUserByToken llama con headers", async () => {
    mockedAxios.get.mockResolvedValue({ data: { id: 1 } });

    const res = await service.getUserByToken("abc");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/persist`,
      { headers: { Authorization: "Bearer abc" } }
    );

    expect(res).toEqual({ id: 1 });
  });

  it("devLogin envía email", async () => {
    mockedAxios.post.mockResolvedValue({ data: { token: "xyz" } });

    const res = await service.devLogin("correo@example.com");

    expect(res.token).toBe("xyz");
  });

  it("refreshToken envía refreshToken", async () => {
    mockedAxios.post.mockResolvedValue({ data: { access: "newToken" } });

    const res = await service.refreshToken("refresh123");

    expect(res.access).toBe("newToken");
  });
});
