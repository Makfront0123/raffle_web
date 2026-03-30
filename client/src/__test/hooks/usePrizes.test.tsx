jest.mock("@/store/prizeStore", () => ({
    usePrizeStore: jest.fn(),
}));

jest.mock("@/store/authStore", () => ({
    AuthStore: () => ({ token: "test-token" }),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { usePrizes } from "../../hook/usePrizes";
import { PrizeStore, usePrizeStore } from "@/store/prizeStore";

let state: PrizeStore;

// ---------- Cast correcto ----------
const mockedUsePrizeStore =
    usePrizeStore as jest.MockedFunction<typeof usePrizeStore>;

describe("usePrizes", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        state = {
            prizes: [],
            winners: [],
            winner: null,

            setPrizes: jest.fn(),
            setWinners: jest.fn(),
            getPrizeById: jest.fn(),

            getPrizes: jest.fn().mockImplementation(async () => {
                state.prizes = [
                    {
                        id: 1,
                        name: "Premio 1",
                        description: "Descripción del premio",
                        value: 10,
                        type: "cash",
                        created_at: new Date().toISOString(),

                        provider: {
                            id: 1,
                            name: "Proveedor",
                            contact_name: "Juan",
                            contact_email: "test@test.com",
                            contact_phone: "123456",
                        },

                        raffle: {
                            id: 1,
                            title: "Rifa test",
                        },

                        winner_ticket: null,
                    },
                ];
            }),

            getWinners: jest.fn().mockResolvedValue(undefined),

            getWinnersByRaffle: jest.fn().mockImplementation(async (id: number) => {
                state.winners = [
                    {
                        prize_id: 1,
                        raffle_id: id,
                        raffle_title: "Rifa test",
                        prize_name: "Premio 1",
                        value: 10,

                        winner_user: {
                            id: 1,
                            name: "Juan",
                            email: "juan@test.com",
                        },

                        winner_ticket: "ABC123",
                    },
                ];
            }),

            addPrize: jest.fn(),
            updatePrize: jest.fn(),
            deletePrize: jest.fn(),
        };

        mockedUsePrizeStore.mockImplementation(
            <T,>(selector: (state: PrizeStore) => T): T =>
                selector(state)
        );
    });

    test("carga premios correctamente", async () => {
        const hook = renderHook(() => usePrizes());

        await waitFor(() => expect(hook.result.current.loading).toBe(false));

        expect(hook.result.current.prizes).toEqual([
            { id: 1, name: "Premio 1" },
        ]);
    });

    test("carga ganadores al seleccionar rifa", async () => {
        const hook = renderHook(() => usePrizes());

        await waitFor(() => expect(hook.result.current.loading).toBe(false));

        await act(async () => {
            hook.result.current.setActiveRaffleId(1);
        });

        await waitFor(() =>
            expect(state.getWinnersByRaffle).toHaveBeenCalledWith(1)
        );

        expect(hook.result.current.winners).toEqual([
            { id: 99, winner: "Juan", raffle_id: 1 },
        ]);
    });

    test("maneja errores en premios", async () => {
        (state.getPrizes as jest.Mock).mockImplementation(async () => {
            throw new Error("fail");
        });

        (state.getWinners as jest.Mock).mockResolvedValue(undefined);

        const hook = renderHook(() => usePrizes());

        await waitFor(() => expect(hook.result.current.loading).toBe(false));

        expect(hook.result.current.error).toBe("Error cargando premios");
    });
});