/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";

import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePrizes } from "@/hook/usePrizes";
import Raffles from "@/app/(user)/raffles/page";

// Mock de hooks
jest.mock("@/hook/useFilteredRaffles");
jest.mock("@/hook/usePrizes");

// Mock router de Next
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
  }),
}));

// Mock componentes que usan framer-motion u otros efectos pesados
jest.mock('@/components/RaffleCard', () => (props: any) => (
  <div data-testid="raffle-card">{props.raffle.title}</div>
));

jest.mock('@/components/user/raffles/RafflesPagination', () => (props: any) => (
  <div data-testid="raffle-pagination" />
));

jest.mock('@/components/user/raffles/RaffleExpiredModal', () => (props: any) => (
  <div data-testid="raffle-expired-modal">
    {props.winners?.map((w: any) => w.name)}
  </div>
));

jest.mock('@/components/user/raffles/RafflesFilters', () => (props: any) => <div data-testid="raffle-filters" />);

beforeAll(() => {
  class IntersectionObserverMock implements IntersectionObserver {
    root: Element | null = null;
    rootMargin: string = "";
    thresholds: ReadonlyArray<number> = [];

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) { }

    disconnect(): void { }
    observe(target: Element): void { }
    unobserve(target: Element): void { }
    takeRecords(): IntersectionObserverEntry[] { return []; }
    readonly [Symbol.toStringTag]: string = "IntersectionObserver";
  }

  Object.defineProperty(global, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
});

describe("Raffles UI", () => {
  const mockSetShowExpiredModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renderiza título principal", () => {
    (useFilteredRaffles as jest.Mock).mockReturnValue({
      filteredRaffles: [],
      loading: false,
      error: null,
      search: "",
      setSearch: jest.fn(),
      filterPrize: "all",
      setFilterPrize: jest.fn(),
      sortBy: "recent",
      setSortBy: jest.fn(),
      tab: "active",
      setTab: jest.fn(),
      showExpiredModal: null,
      setShowExpiredModal: mockSetShowExpiredModal,
      winners: [],
      loadingWinner: false,
    });

    (usePrizes as jest.Mock).mockReturnValue({
      winners: [],
      loading: false,
      error: null,
      setActiveRaffleId: jest.fn(),
    });

    render(<Raffles />);
    expect(screen.getByText("🎟️ Rifas Premium")).toBeInTheDocument();
  });

  it("Muestra loader cuando loading es true", () => {
    (useFilteredRaffles as jest.Mock).mockReturnValue({
      filteredRaffles: [],
      loading: true,
      error: null,
      search: "",
      setSearch: jest.fn(),
      filterPrize: "all",
      setFilterPrize: jest.fn(),
      sortBy: "recent",
      setSortBy: jest.fn(),
      tab: "active",
      setTab: jest.fn(),
      showExpiredModal: null,
      setShowExpiredModal: mockSetShowExpiredModal,
      winners: [],
      loadingWinner: false,
    });

    (usePrizes as jest.Mock).mockReturnValue({
      winners: [],
      loading: false,
      error: null,
      setActiveRaffleId: jest.fn(),
    });

    render(<Raffles />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("Muestra error cuando hay error", () => {
    (useFilteredRaffles as jest.Mock).mockReturnValue({
      filteredRaffles: [],
      loading: false,
      error: "Error cargando rifas",
      search: "",
      setSearch: jest.fn(),
      filterPrize: "all",
      setFilterPrize: jest.fn(),
      sortBy: "recent",
      setSortBy: jest.fn(),
      tab: "active",
      setTab: jest.fn(),
      showExpiredModal: null,
      setShowExpiredModal: mockSetShowExpiredModal,
      winners: [],
      loadingWinner: false,
    });

    (usePrizes as jest.Mock).mockReturnValue({
      winners: [],
      loading: false,
      error: null,
      setActiveRaffleId: jest.fn(),
    });

    render(<Raffles />);
    expect(screen.getByText("Error cargando rifas")).toBeInTheDocument();
  });

  it("Renderiza rifas paginadas", () => {
    const mockRaffles = [
      { id: 1, title: "Rifa 1", description: "Desc 1", status: "active", prizes: [], price: 1000, end_date: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 2, title: "Rifa 2", description: "Desc 2", status: "active", prizes: [], price: 2000, end_date: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 3, title: "Rifa 3", description: "Desc 3", status: "active", prizes: [], price: 3000, end_date: new Date().toISOString(), created_at: new Date().toISOString() },
    ];

    (useFilteredRaffles as jest.Mock).mockReturnValue({
      filteredRaffles: mockRaffles,
      loading: false,
      error: null,
      search: "",
      setSearch: jest.fn(),
      filterPrize: "all",
      setFilterPrize: jest.fn(),
      sortBy: "recent",
      setSortBy: jest.fn(),
      tab: "active",
      setTab: jest.fn(),
      showExpiredModal: null,
      setShowExpiredModal: mockSetShowExpiredModal,
      winners: [],
      loadingWinner: false,
    });

    (usePrizes as jest.Mock).mockReturnValue({
      winners: [],
      loading: false,
      error: null,
      setActiveRaffleId: jest.fn(),
    });

    render(<Raffles />);
    expect(screen.getByText("Rifa 1")).toBeInTheDocument();
    expect(screen.getByText("Rifa 2")).toBeInTheDocument();
    expect(screen.getByText("Rifa 3")).toBeInTheDocument();
  });

  it("Abre modal cuando showExpiredModal tiene datos", () => {
    const mockRaffle = { id: 1, title: "Rifa 1", description: "Desc", status: "ended", prizes: [], price: 1000, end_date: new Date().toISOString(), created_at: new Date().toISOString() };

    (useFilteredRaffles as jest.Mock).mockReturnValue({
      filteredRaffles: [mockRaffle],
      loading: false,
      error: null,
      search: "",
      setSearch: jest.fn(),
      filterPrize: "all",
      setFilterPrize: jest.fn(),
      sortBy: "recent",
      setSortBy: jest.fn(),
      tab: "active",
      setTab: jest.fn(),
      showExpiredModal: mockRaffle,
      setShowExpiredModal: mockSetShowExpiredModal,
      winners: [{ id: 1, name: "Ganador" }],
      loadingWinner: false,
    });

    (usePrizes as jest.Mock).mockReturnValue({
      winners: [{ id: 1, name: "Ganador" }],
      loading: false,
      error: null,
      setActiveRaffleId: jest.fn(),
    });

    render(<Raffles />);
    expect(screen.getByText("Ganador")).toBeInTheDocument();
  });
});
