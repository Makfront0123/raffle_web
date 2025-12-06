import { AuthService } from "@/services/authService";
import { AuthStore } from "@/store/authStore";
import { act } from "@testing-library/react";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("AuthStore", () => {
  beforeEach(() => {
    AuthStore.setState({ user: null, token: null });
    localStorage.clear();
  });

  it("devLogin guarda user/token", async () => {
    // 👈 El mock correcto
    jest
      .spyOn(AuthService.prototype, "devLogin")
      .mockResolvedValue({
        user: { name: "Armando" },
        token: "tok123",
      });

    await act(async () => {
      await AuthStore.getState().devLogin("armando@test.com");
    });

    expect(AuthStore.getState().token).toBe("tok123");
    expect(AuthStore.getState().user?.name).toBe("Armando");
  });
});
