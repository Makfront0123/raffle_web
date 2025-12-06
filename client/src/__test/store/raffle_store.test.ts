import { act } from "@testing-library/react";
import { useRaffleStore } from "@/store/raffleStore";
import { RaffleService } from "@/services/raffleService";

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockRaffle: any = {
  id: 1,
  title: "Rifa 1",
  description: "desc",
  price: 5000,
  end_date: "2025-12-31",
  digits: 3,
  is_active: true,
  created_at: "2025-01-01",
  updated_at: "2025-01-01",
};

describe("RaffleStore", () => {
  beforeEach(() => {
    useRaffleStore.setState({ raffles: [] });
  });

  it("getRaffles carga rifas", async () => {
    jest
      .spyOn(RaffleService.prototype, "getAllRaffles")
      .mockResolvedValue([mockRaffle]);

    await act(async () => {
      await useRaffleStore.getState().getRaffles("token");
    });

    expect(useRaffleStore.getState().raffles.length).toBe(1);
  });

  it("addRaffle agrega una rifa", async () => {
    jest
      .spyOn(RaffleService.prototype, "createRaffle")
      .mockResolvedValue({ ...mockRaffle, id: 99 });

    await act(async () => {
      await useRaffleStore.getState().addRaffle(
        { title: "Nueva Rifa" },
        "token"
      );
    });

    expect(useRaffleStore.getState().raffles[0].id).toBe(99);
  });

  it("deleteRaffle elimina rifa", async () => {
    useRaffleStore.setState({
      raffles: [{ ...mockRaffle, id: 10 }],
    });

    jest
      .spyOn(RaffleService.prototype, "deleteRaffle")
      .mockResolvedValue(undefined); // ✔ correcto

    await act(async () => {
      await useRaffleStore.getState().deleteRaffle(10, "token");
    });

    expect(useRaffleStore.getState().raffles.length).toBe(0);
  });
});
