import { AuthStore } from "@/store/authStore";
import { act } from "@testing-library/react";

jest.mock("@/services/authService", () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    logout: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe("AuthStore", () => {
  beforeEach(() => {
    AuthStore.setState({ user: null });
    localStorage.clear();
  });

  it("inicializa con user null", () => {
    expect(AuthStore.getState().user).toBeNull();
  });

  it("setUser guarda el user correctamente", () => {
    const mockUser = { id: 1, name: "Armando", email: "armando@test.com" };

    AuthStore.getState().setUser(mockUser);

    expect(AuthStore.getState().user).toEqual(mockUser);
  });

  it("logout resetea el user a null", async () => {
    const mockUser = { id: 1, name: "Armando", email: "armando@test.com" };

    act(() => {
      AuthStore.getState().setUser(mockUser);
    });

    expect(AuthStore.getState().user).toEqual(mockUser);

    await act(async () => {
      await AuthStore.getState().logout();
    });

    expect(AuthStore.getState().user).toBeNull();
  });
});
