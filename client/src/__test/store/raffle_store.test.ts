import { act } from "@testing-library/react";
import { useRaffleStore } from "@/store/raffleStore";
import { RaffleService } from "@/services/raffleService";
import { Raffle } from "@/type/Raffle";


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
    jest.clearAllMocks();
  });

  it("getRaffles carga rifas", async () => {
    jest
      .spyOn(RaffleService.prototype, "getAllRaffles")
      .mockResolvedValue([mockRaffle as Raffle]);

    await act(async () => {
      await useRaffleStore.getState().getRaffles();
    });

    const state = useRaffleStore.getState();
    expect(state.raffles.length).toBe(1);
    expect(state.raffles[0].id).toBe(1);
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
      } as Raffle);

    await act(async () => {
      await useRaffleStore.getState().addRaffle({
        title: "Nueva Rifa",
        price: 5000,
        digits: 3,
      });
    });

    const state = useRaffleStore.getState();
    expect(state.raffles.length).toBe(1);
    expect(state.raffles[0].id).toBe(99);
  });

  it("deleteRaffle elimina rifa", async () => {
    // Seteamos estado inicial
    useRaffleStore.setState({
      raffles: [
        {
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
        },
      ],
    });

    jest
      .spyOn(RaffleService.prototype, "deleteRaffle")
      .mockResolvedValue(undefined);

    await act(async () => {
      await useRaffleStore.getState().deleteRaffle(99);
    });

    const state = useRaffleStore.getState();
    expect(state.raffles.length).toBe(0);
  });
});