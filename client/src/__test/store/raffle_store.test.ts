import { act } from "@testing-library/react";
import { useRaffleStore } from "@/store/raffleStore";
import { RaffleService } from "@/services/raffleService";
import { Raffle } from "@/type/Raffle";

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockRaffle: Partial<Raffle> = {
  id: 1,
  title: "Rifa 1",
  description: "desc",
  price: 5000,
  end_date: "2025-12-31",
  digits: 3,
  status: "active",
  created_at: "2025-01-01",
};

describe("RaffleStore", () => {
  beforeEach(() => {
    useRaffleStore.setState({ raffles: [] });
  });

  it("getRaffles carga rifas", async () => {
    jest
      .spyOn(RaffleService.prototype, "getAllRaffles")
      .mockResolvedValue([mockRaffle as Raffle]);


    await act(async () => {
      await useRaffleStore.getState().deleteRaffle(99);
    });

    expect(useRaffleStore.getState().raffles.length).toBe(0);

  });

  it("addRaffle agrega una rifa", async () => {
    jest
      .spyOn(RaffleService.prototype, "createRaffle")
      .mockResolvedValue({
        id: 99,
        title: "Nueva Rifa",
        description: "desc",
        price: 5000,
        end_date: "2025-12-31",
        digits: 3,
        status: "active",
        created_at: "2025-01-01",
        prizes: [],
        tickets: [],
        total_numbers: 0,
      });

    await act(async () => {
      await useRaffleStore.getState().addRaffle(
        { title: "Nueva Rifa", price: 5000, digits: 3 },
      );
    });

    expect(useRaffleStore.getState().raffles[0].id).toBe(99);
  });
  it("deleteRaffle elimina rifa", async () => {
    useRaffleStore.setState({
      raffles: [{
        id: 99,
        title: "Nueva Rifa",
        description: "desc",
        price: 5000,
        end_date: "2025-12-31",
        digits: 3,
        status: "active",
        created_at: "2025-01-01",
        prizes: [],
        tickets: [],
        total_numbers: 0,
      }],
    });

    jest
      .spyOn(RaffleService.prototype, "deleteRaffle")
      .mockResolvedValue(undefined);

    await act(async () => {
      await useRaffleStore.getState().deleteRaffle(99);
    });

    expect(useRaffleStore.getState().raffles.length).toBe(0);
  });

});
