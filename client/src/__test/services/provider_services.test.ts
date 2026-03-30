import { ProviderService } from "@/services/providerService";
import { api } from "@/api/api";
import { Providers } from "@/type/Providers";
import { AxiosResponse } from "axios";

jest.mock("@/api/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("ProviderService", () => {
  const service = new ProviderService();

  const providerMock: Providers = {
    id: 1,
    name: "Proveedor Test",
    contact_phone: "12345",
    contact_email: "test@mail.com",
    contact_name: "Test",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAllProviders → retorna lista de providers", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: [providerMock],
    } as AxiosResponse<Providers[]>);

    const res = await service.getAllProviders();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/providers");
    expect(res).toEqual([providerMock]);
  });

  it("getProviderById → retorna un provider", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: providerMock,
    } as AxiosResponse<Providers>);

    const res = await service.getProviderById(1);

    expect(mockedApi.get).toHaveBeenCalledWith("/api/providers/1");
    expect(res).toEqual(providerMock);
  });

  it("createProvider → retorna provider creado", async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: providerMock,
    } as AxiosResponse<Providers>);

    const res = await service.createProvider(providerMock);

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/providers",
      providerMock
    );

    expect(res).toEqual(providerMock);
  });

  it("updateProvider → retorna provider actualizado", async () => {
    const updated: Providers = {
      ...providerMock,
      name: "Nuevo Nombre",
    };

    mockedApi.put.mockResolvedValueOnce({
      data: updated,
    } as AxiosResponse<Providers>);

    const res = await service.updateProvider(1, updated);

    expect(mockedApi.put).toHaveBeenCalledWith(
      "/api/providers/1",
      updated
    );

    expect(res).toEqual(updated);
  });

  it("deleteProvider → retorna void", async () => {
    mockedApi.delete.mockResolvedValueOnce({
      data: undefined,
    } as AxiosResponse<void>);

    const res = await service.deleteProvider(1);

    expect(mockedApi.delete).toHaveBeenCalledWith("/api/providers/1");
    expect(res).toBeUndefined();
  });

  it("deleteProvider → lanza error si backend falla", async () => {
    mockedApi.delete.mockRejectedValueOnce({
      response: {
        data: {
          message: "Error desde backend",
        },
      },
    });

    await expect(service.deleteProvider(1)).rejects.toMatchObject({
      response: {
        data: {
          message: "Error desde backend",
        },
      },
    });

    expect(mockedApi.delete).toHaveBeenCalledWith("/api/providers/1");
  });
});
