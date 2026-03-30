import { renderHook, act } from "@testing-library/react";
import type { ChangeEvent, FormEvent } from "react";
import { useProvidersLogic } from "@/hook/useProviderLogic";


jest.mock("@/store/authStore", () => ({
  AuthStore: () => ({ user: { id: 1, name: "Armando" }, token: "fake-token" }),
}));

jest.mock("@/hook/useZodForm", () => ({
  useZodForm: () => ({
    form: {
      name: "Nuevo",
      contact_name: "Juan",
      contact_email: "juan@test.com",
      contact_phone: "123456",
    },
    setForm: jest.fn(),
    handleChange: jest.fn(),
    validate: () => true,
    errors: {},
  }),
}));

const mockUseProviders = {
  providers: [
    {
      id: 1,
      name: "Test",
      contact_name: "A",
      contact_email: "a@test.com",
      contact_phone: "123",
    },
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
    jest.clearAllMocks();
  });

  const setup = () => renderHook(() => useProvidersLogic());



  it("debe llamar addProvider cuando form no tiene id", async () => {
    const { result } = setup();

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Nuevo" },
      } as any);

      result.current.handleChange({
        target: { name: "contact_name", value: "Juan" },
      } as any);

      result.current.handleChange({
        target: { name: "contact_email", value: "juan@test.com" },
      } as any);

      result.current.handleChange({
        target: { name: "contact_phone", value: "123456" },
      } as any);
    });


    const submitEvent = {
      preventDefault: jest.fn(),
    } as unknown as FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(mockUseProviders.addProvider).toHaveBeenCalledTimes(1);
    expect(mockUseProviders.fetchProviders).toHaveBeenCalledTimes(1);
  });

  it("debe llamar deleteProvider y luego fetchProviders", async () => {
    const { result } = setup();

    act(() => {
      result.current.requestDeleteProvider(1);
    });


    await act(async () => {
      await result.current.confirmDeleteProvider();
    });

    expect(mockUseProviders.deleteProvider).toHaveBeenCalledWith(1);
    expect(mockUseProviders.fetchProviders).toHaveBeenCalledTimes(1);
  });
});
