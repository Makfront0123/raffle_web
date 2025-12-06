/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { useRaffles } from "@/hook/useRaffles";

jest.mock("@/hook/useRaffles");

const mockRaffles = [
    {
        id: 1,
        title: "Carro deportivo",
        description: "Un carro de lujo",
        status: "active",
        price: 500,
        created_at: "2024-01-10",
        end_date: "2024-03-01",
        prizes: [{ type: "car" }],
    },
    {
        id: 2,
        title: "iPhone 15",
        description: "Último modelo",
        status: "active",
        price: 200,
        created_at: "2024-02-01",
        end_date: "2024-02-28",
        prizes: [{ type: "tech" }],
    },
    {
        id: 3,
        title: "PC Gamer",
        description: "RTX 4090",
        status: "ended",
        price: 800,
        created_at: "2024-01-05",
        end_date: "2024-02-01",
        prizes: [{ type: "tech" }],
    },
];

describe("useFilteredRaffles", () => {
    beforeEach(() => {
        (useRaffles as jest.Mock).mockReturnValue({
            raffles: mockRaffles,
            loading: false,
            error: null,
        });
    });
 
    it("filtra por búsqueda en título y descripción", () => {
        const { result } = renderHook(() => useFilteredRaffles());

        act(() => {
            result.current.setSearch("iPhone");
        });

        expect(result.current.filteredRaffles?.length).toBe(1);
        expect(result.current.filteredRaffles?.[0].title).toBe("iPhone 15");
    });
 
    it("filtra por tipo de premio", () => {
        const { result } = renderHook(() => useFilteredRaffles());

        act(() => {
            result.current.setTab("all");
        });

        act(() => {
            result.current.setFilterPrize("tech");
        });

        expect(result.current.filteredRaffles?.length).toBe(2);
        expect(result.current.filteredRaffles?.map((r) => r.title)).toEqual([
            "iPhone 15",
            "PC Gamer",
        ]);
    });

 
    it("muestra solo las rifas activas cuando tab = 'active'", () => {
        const { result } = renderHook(() => useFilteredRaffles());

        act(() => {
            result.current.setTab("active");
        });

        expect(result.current.filteredRaffles?.length).toBe(2);
        expect(result.current.filteredRaffles?.every((r) => r.status === "active")).toBe(true);
    });

    it("muestra solo las rifas terminadas cuando tab = 'ended'", () => {
        const { result } = renderHook(() => useFilteredRaffles());

        act(() => {
            result.current.setTab("ended");
        });

        expect(result.current.filteredRaffles?.length).toBe(1);
        expect(result.current.filteredRaffles?.[0].status).toBe("ended");
    });

 
    it("ordena por precio cuando sortBy = 'price'", () => {
        const { result } = renderHook(() => useFilteredRaffles());

        act(() => {
            result.current.setSortBy("price");
        });

        const list = result.current.filteredRaffles!;
        expect(list[0].price).toBeGreaterThanOrEqual(list[1].price);
    });

    it("ordena por fecha de creación (recent)", () => {
        const { result } = renderHook(() => useFilteredRaffles());

        act(() => {
            result.current.setSortBy("recent");
        });

        const list = result.current.filteredRaffles!;
        expect(
            new Date(list[0].created_at).getTime()
        ).toBeGreaterThan(
            new Date(list[1].created_at).getTime()
        );
    });

    it("ordena por fecha de finalización (endingSoon)", () => {
        const { result } = renderHook(() => useFilteredRaffles());

        act(() => {
            result.current.setSortBy("endingSoon");
        });

        const list = result.current.filteredRaffles!;
        expect(
            new Date(list[0].end_date).getTime()
        ).toBeLessThanOrEqual(
            new Date(list[1].end_date).getTime()
        );
    });
});
