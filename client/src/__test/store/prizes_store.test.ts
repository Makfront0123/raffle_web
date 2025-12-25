import { act } from "@testing-library/react";
import { usePrizeStore } from "@/store/prizeStore";
import { PrizeService } from "@/services/prizeService";

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const fullPrize = {
  id: 1,
  name: "Premio 1",
  description: "Desc 1",
  value: 1000,
  type: "cash",
  created_at: "2024-01-01",
  provider: {
    id: 1,
    name: "Prov",
    contact_name: "Contacto",
    contact_email: "prov@test.com",
    contact_phone: "123",
  },
  raffle: {
    id: 10,
    title: "Rifa X",
  },
  winner_ticket: null,
};

describe("PrizeStore", () => {
  beforeEach(() => {
    usePrizeStore.setState({ prizes: [], winners: [] });
  });

  // ---------------------------------------------------------------------

  it("getPrizes carga los premios", async () => {
    jest
      .spyOn(PrizeService.prototype, "getAllPrizes")
      .mockResolvedValue([fullPrize]);

    await act(async () => {
      await usePrizeStore.getState().getPrizes("token");
    });

    expect(usePrizeStore.getState().prizes.length).toBe(1);
  });

  // ---------------------------------------------------------------------

  it("addPrize agrega un premio", async () => {
    const newPrize = {
      ...fullPrize,
      id: 25,
      name: "Nuevo Premio",
    };

    jest
      .spyOn(PrizeService.prototype, "createPrize")
      .mockResolvedValue({
        message: "ok",
        data: newPrize,
      });

    await act(async () => {
      await usePrizeStore.getState().addPrize(
        {
          name: "x",
          description: "x",
          value: 10,
          type: "cash",
          raffleId: 1,
          providerId: 1,
        },
        "token"
      );
    });

    expect(usePrizeStore.getState().prizes[0].id).toBe(25);
  });

  // ---------------------------------------------------------------------

  it("deletePrize elimina un premio", async () => {
    usePrizeStore.setState({
      prizes: [fullPrize],
    });

    jest
      .spyOn(PrizeService.prototype, "deletePrize")
      .mockResolvedValue({
        message: "ok",
        data: undefined, // BackendResponse<void>
      });

    await act(async () => {
      await usePrizeStore.getState().deletePrize(1, "token");
    });

    expect(usePrizeStore.getState().prizes.length).toBe(0);
  });

  // ---------------------------------------------------------------------

  it("getWinners obtiene ganadores", async () => {
    const winnerMock = [
      {
        id: 99,
        winner_ticket: {
          id: 1,
          number: 50,
          user: { id: 9, name: "Armando" },
        },
      },
    ];

    jest
      .spyOn(PrizeService.prototype, "getWinners")
      .mockResolvedValue(winnerMock as any);

    await act(async () => {
      await usePrizeStore.getState().getWinnersByRaffle(5, "token");
    });

    expect(usePrizeStore.getState().winners.length).toBe(1);
  });
});
