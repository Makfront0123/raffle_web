import { AuthStore } from "@/store/authStore";
import { act } from "@testing-library/react";

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
    
    act(() => {
      AuthStore.getState().setUser(mockUser);
    });

    expect(AuthStore.getState().user).toEqual(mockUser);
  });

  it("logout resetea el user a null", async () => {
  const mockUser = { id: 1, name: "Armando", email: "armando@test.com" };

  await act(async () => {
    AuthStore.getState().setUser(mockUser);
  });

  expect(AuthStore.getState().user).toEqual(mockUser);

  await act(async () => {
    await AuthStore.getState().logout();
  });

  expect(AuthStore.getState().user).toBeNull();
});

});
