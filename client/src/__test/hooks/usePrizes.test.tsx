
jest.mock("@/store/prizeStore", () => ({
    usePrizeStore: jest.fn(),
}));

jest.mock("@/store/authStore", () => ({
    AuthStore: () => ({ token: "test-token" }),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { usePrizes } from "../../hook/usePrizes";
import { usePrizeStore } from "@/store/prizeStore";

// ---------- Types ----------
interface Prize {
    id: number;
    name: string;
}

interface Winner {
    id: number;
    winner: string;
    raffle_id: number;
}

interface PrizeStoreState {
    prizes: Prize[];
    winners: Winner[];
    getPrizes: jest.Mock<Promise<void>, []>;
    getWinners: jest.Mock<Promise<void>, []>;
    addPrize: jest.Mock;
    updatePrize: jest.Mock;
    deletePrize: jest.Mock;
}

// ---------- Cast ----------
const mockedUsePrizeStore =
    usePrizeStore as jest.MockedFunction<typeof usePrizeStore>;

let state: PrizeStoreState;

describe("usePrizes", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        state = {
            prizes: [],
            winners: [],
            getPrizes: jest.fn().mockImplementation(async () => {
                state.prizes = [{ id: 1, name: "Premio 1" }];
            }),
            getWinners: jest.fn().mockImplementation(async () => {
                state.winners = [{ id: 99, winner: "Juan", raffle_id: 1 }];
            }),
            addPrize: jest.fn(),
            updatePrize: jest.fn(),
            deletePrize: jest.fn(),
        };

        mockedUsePrizeStore.mockReturnValue(state);
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

        await waitFor(() => expect(state.getWinners).toHaveBeenCalled());

        expect(hook.result.current.winners).toEqual([
            { id: 99, winner: "Juan", raffle_id: 1 },
        ]);
    });

    test("maneja errores en premios", async () => {
        state.getPrizes.mockImplementation(async () => {
            throw new Error("fail");
        });

        const hook = renderHook(() => usePrizes());

        await waitFor(() => expect(hook.result.current.loading).toBe(false));

        expect(hook.result.current.error).toBe("Error cargando premios");
    });
});
