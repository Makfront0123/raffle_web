import { useProvidersLogic } from "@/hook/useProviderLogic";
import { renderHook, act } from "@testing-library/react";
 

jest.mock("@/store/authStore", () => ({
  AuthStore: () => ({ token: "fake-token" }),
}));

 
const mockUseProviders = {
  providers: [
    { id: 1, name: "Test", contact_name: "A", contact_email: "a@test.com", contact_phone: "123" },
  ],
  loading: false,
  error: null,
  addProvider: jest.fn(),
  updateProvider: jest.fn(),
  deleteProvider: jest.fn(),
  fetchProviders: jest.fn(),
};

jest.mock("@/hook/useProviders", () => ({
  useProviders: () => mockUseProviders,
}));

describe("useProvidersLogic", () => {
  beforeEach(() => {
   
    mockUseProviders.addProvider.mockClear();
    mockUseProviders.updateProvider.mockClear();
    mockUseProviders.deleteProvider.mockClear();
    mockUseProviders.fetchProviders.mockClear();
  });

  const setup = () => renderHook(() => useProvidersLogic());

  it("debe llamar addProvider cuando form no tiene id", async () => {
    const { result } = setup();

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Nuevo" },
      } as any);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as any);
    });

    expect(mockUseProviders.addProvider).toHaveBeenCalledTimes(1);
  });

  it("debe llamar deleteProvider y luego fetchProviders", async () => {
    const { result } = setup();

    act(() => {
      result.current.requestDeleteProvider(1);
    });

    await act(async () => {
      await result.current.confirmDeleteProvider();
    });

    expect(mockUseProviders.deleteProvider).toHaveBeenCalledWith(1, "fake-token");
    expect(mockUseProviders.fetchProviders).toHaveBeenCalledTimes(1);
  });
});
