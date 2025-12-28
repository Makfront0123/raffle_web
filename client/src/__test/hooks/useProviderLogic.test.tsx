import { useProvidersLogic } from "@/hook/useProviderLogic";
import { renderHook, act } from "@testing-library/react";
import type { ChangeEvent, FormEvent } from "react";

jest.mock("@/store/authStore", () => ({
  AuthStore: () => ({ token: "fake-token" }),
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

    const changeEvent: ChangeEvent<HTMLInputElement> = {
      target: {
        name: "name",
        value: "Nuevo",
      },
    } as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(changeEvent);
    });

    const submitEvent = {
      preventDefault: jest.fn(),
    } as unknown as FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
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

    expect(mockUseProviders.deleteProvider).toHaveBeenCalledWith(
      1,
      "fake-token"
    );
    expect(mockUseProviders.fetchProviders).toHaveBeenCalledTimes(1);
  });
});
