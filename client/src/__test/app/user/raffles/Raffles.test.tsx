/**
 * Los mocks deben ir ANTES de los imports reales
 */
jest.mock("@radix-ui/react-dialog", () => {
  const original = jest.requireActual("@radix-ui/react-dialog");

  return {
    ...original,
    DialogContent: ({ children }: any) => <div>{children}</div>,
  };
});

jest.mock("@/hook/useFilteredRaffles", () => ({
  useFilteredRaffles: jest.fn()
}));

jest.mock("@/hook/usePrizes", () => ({
  usePrizes: jest.fn()
}));

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePrizes } from "@/hook/usePrizes";
import Raffles from "@/components/user/raffles/RafflesContainer";

/** Tipado estricto de mocks */
const mockUseFilteredRaffles = useFilteredRaffles as jest.MockedFunction<
  typeof useFilteredRaffles
>;
const mockUsePrizes = usePrizes as jest.MockedFunction<typeof usePrizes>;

/** Mock de datos Raffle */
const mockRaffles = [
  {
    id: 1,
    title: "Rifa 1",
    description: "Desc 1",
    price: 100,
    end_date: "2025-01-01",
    digits: 4,
    total_numbers: 100,
    status: "active",
    created_at: "2025-01-01",
    tickets: [],
    prizes: []
  },
  {
    id: 2,
    title: "Rifa 2",
    description: "Desc 2",
    price: 200,
    end_date: "2025-01-01",
    digits: 4,
    total_numbers: 100,
    status: "ended",
    created_at: "2025-01-01",
    tickets: [],
    prizes: []
  }
];

describe("Raffles UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    /** Mock principal: useFilteredRaffles */
    mockUseFilteredRaffles.mockReturnValue({
      raffles: mockRaffles,
      filteredRaffles: mockRaffles,
      loading: false,
      error: null,
      search: "",
      setSearch: jest.fn(),
      filterPrize: "all",
      setFilterPrize: jest.fn(),
      sortBy: "recent",
      setSortBy: jest.fn(),

      /** 🔥 Importante: ahora tab incluye "all" */
      tab: "active",
      setTab: jest.fn(),

      showExpiredModal: null,
      setShowExpiredModal: jest.fn()
    });

    /** Mock principal: usePrizes */
    mockUsePrizes.mockReturnValue({
      prizes: [],
      winners: [],
      loading: false,
      error: null,
      filterRaffle: "all",
      setFilterRaffle: jest.fn(),
      setActiveRaffleId: jest.fn(),
      createPrize: jest.fn(),
      editPrize: jest.fn(),
      deletePrize: jest.fn(),
      updatePrize: jest.fn()
    });
  });

  test("Renderiza título principal", () => {
    render(<Raffles />);
    expect(screen.getByText("🎟️ Explora nuestras rifas")).toBeInTheDocument();
  });

  test("Renderiza rifas paginadas", () => {
    render(<Raffles />);
    expect(screen.getByText("Rifa 1")).toBeInTheDocument();
    expect(screen.getByText("Rifa 2")).toBeInTheDocument();
  });

  test("Abre modal cuando showExpiredModal tiene datos", () => {
    mockUseFilteredRaffles.mockReturnValueOnce({
      ...mockUseFilteredRaffles(),
      showExpiredModal: mockRaffles[1] // Rifa 2
    });

    render(<Raffles />);

    // El modal aparece
    expect(screen.getByText("Rifa finalizada")).toBeInTheDocument();

    // Todas las instancias de "Rifa 2"
    const titles = screen.getAllByText("Rifa 2");

    // Aseguramos que realmente hay 2
    expect(titles.length).toBeGreaterThanOrEqual(2);

    // O puedes validar SOLO el del modal:
    expect(
      screen.getByText((content, element) =>
        content === "Rifa 2" && element?.tagName.toLowerCase() === "strong"
      )
    ).toBeInTheDocument();
  });


  test("Llama setActiveRaffleId cuando modal se abre", () => {
    const setActive = jest.fn();

    mockUseFilteredRaffles.mockReturnValueOnce({
      ...mockUseFilteredRaffles(),
      showExpiredModal: mockRaffles[1]
    });

    mockUsePrizes.mockReturnValueOnce({
      ...mockUsePrizes(),
      setActiveRaffleId: setActive
    });

    render(<Raffles />);

    expect(setActive).toHaveBeenCalledWith(2);
  });
});
