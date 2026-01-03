import { PrizeService } from "@/services/prizeService";
import { api } from "@/api/api";

jest.mock("@/api/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("PrizeService", () => {
  const service = new PrizeService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAllPrizes retorna premios", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: [{ id: 1 }],
    } as any);

    const res = await service.getAllPrizes();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/prizes");
    expect(res[0].id).toBe(1);
  });

  it("getPrizeById obtiene un premio", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: { id: 50 },
    } as any);

    const res = await service.getPrizeById(50);

    expect(mockedApi.get).toHaveBeenCalledWith("/api/prizes/50");
    expect(res.id).toBe(50);
  });

  it("createPrize retorna BackendResponse", async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: {
        message: "ok",
        data: { id: 5 },
      },
    } as any);

    const dto = {
      name: "TV",
      description: "LCD",
      value: 1000,
      type: "electronic",
      raffleId: 1,
      providerId: 1,
    };

    const res = await service.createPrize(dto);

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/prizes",
      dto
    );

    expect(res.data.id).toBe(5);
  });

  it("updatePrize retorna BackendResponse", async () => {
    mockedApi.patch.mockResolvedValueOnce({
      data: {
        message: "updated",
        data: { id: 3 },
      },
    } as any);

    const res = await service.updatePrize(3, { name: "Nuevo" });

    expect(mockedApi.patch).toHaveBeenCalledWith(
      "/api/prizes/3",
      { name: "Nuevo" }
    );

    expect(res.message).toBe("updated");
  });

  it("getWinners retorna lista de ganadores", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: [{ id: 1 }],
    } as any);

    const res = await service.getWinners();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/prizes/winners");
    expect(res.length).toBe(1);
  });

  it("deletePrize envía DELETE", async () => {
    mockedApi.delete.mockResolvedValueOnce({
      data: { message: "deleted" },
    } as any);

    const res = await service.deletePrize(10);

    expect(mockedApi.delete).toHaveBeenCalledWith("/api/prizes/10");
    expect(res.message).toBe("deleted");
  });
});
