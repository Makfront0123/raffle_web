import { Raffle } from "@/type/Raffle";
import { RaffleService } from "@/services/raffleService";
import { api } from "@/api/api";

jest.mock("@/api/api");

const mockedApi = api as jest.Mocked<typeof api>;

describe("RaffleService tests", () => {
  const service = new RaffleService();

  const raffleMock: Raffle = {
    id: 1,
    title: "Rifa 1",
    description: "Descripción",
    total_numbers: 100,
    digits: 3,
    price: 5000,
    status: "active",
    created_at: "2024-01-01",
    end_date: "2024-01-01",
    prizes: [],
    tickets: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAllRaffles → retorna lista", async () => {
    mockedApi.get.mockResolvedValue({ data: [raffleMock] });

    const res = await service.getAllRaffles();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/raffle");
    expect(res).toEqual([raffleMock]);
  });

  it("getRaffleById → retorna una rifa", async () => {
    mockedApi.get.mockResolvedValue({ data: raffleMock });

    const res = await service.getRaffleById(1);

    expect(mockedApi.get).toHaveBeenCalledWith("/api/raffle/1");
    expect(res).toEqual(raffleMock);
  });

  it("createRaffle → retorna creada", async () => {
    mockedApi.post.mockResolvedValue({ data: raffleMock });

    const res = await service.createRaffle(raffleMock);

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/raffle",
      raffleMock
    );
    expect(res).toEqual(raffleMock);
  });

  it("updateRaffle → retorna actualizada", async () => {
    const updated = { ...raffleMock, title: "Nueva Rifa" };

    mockedApi.patch.mockResolvedValue({ data: updated });

    const res = await service.updateRaffle(1, updated);

    expect(mockedApi.patch).toHaveBeenCalledWith(
      "/api/raffle/1",
      updated
    );
    expect(res).toEqual(updated);
  });

  it("deleteRaffle → retorna void", async () => {
    mockedApi.delete.mockResolvedValue({ data: undefined });

    const res = await service.deleteRaffle(1);

    expect(mockedApi.delete).toHaveBeenCalledWith("/api/raffle/1");
    expect(res).toBeUndefined();
  });

  it("regenerateTickets → retorna void", async () => {
    mockedApi.put.mockResolvedValue({ data: undefined });

    const res = await service.regenerateTickets(1, 4);

    expect(mockedApi.put).toHaveBeenCalledWith(
      "/api/raffle/1/regenerate-tickets/4"
    );
    expect(res).toBeUndefined();
  });

  it("activateRaffle → retorna void", async () => {
    mockedApi.put.mockResolvedValue({ data: undefined });

    const res = await service.activateRaffle(1);

    expect(mockedApi.put).toHaveBeenCalledWith(
      "/api/raffle/1/activate"
    );
    expect(res).toBeUndefined();
  });

  it("deactivateRaffle → retorna void", async () => {
    mockedApi.put.mockResolvedValue({ data: undefined });

    const res = await service.deactivateRaffle(1);

    expect(mockedApi.put).toHaveBeenCalledWith(
      "/api/raffle/1/deactivate"
    );
    expect(res).toBeUndefined();
  });
});
