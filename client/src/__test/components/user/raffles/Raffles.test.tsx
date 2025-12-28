/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import React from "react";

import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePrizes } from "@/hook/usePrizes";
import Raffles from "@/app/(user)/raffles/page";

// ---------- Types ----------
interface MockRaffle {
  id: number;
  title: string;
}

interface MockWinner {
  id: number;
  name: string;
}

// ---------- Mocks ----------
jest.mock("@/hook/useFilteredRaffles");
jest.mock("@/hook/usePrizes");

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
  }),
}));

// ---------- Component Mocks ----------
jest.mock("@/components/RaffleCard", () => {
  const RaffleCardMock: React.FC<{ raffle: MockRaffle }> = ({ raffle }) => (
    <div data-testid="raffle-card">{raffle.title}</div>
  );

  RaffleCardMock.displayName = "RaffleCardMock";
  return RaffleCardMock;
});

jest.mock("@/components/user/raffles/RafflesPagination", () => {
  const PaginationMock: React.FC = () => (
    <div data-testid="raffle-pagination" />
  );

  PaginationMock.displayName = "RafflesPaginationMock";
  return PaginationMock;
});

jest.mock("@/components/user/raffles/RaffleExpiredModal", () => {
  const ExpiredModalMock: React.FC<{ winners?: MockWinner[] }> = ({ winners }) => (
    <div data-testid="raffle-expired-modal">
      {winners?.map((w) => w.name)}
    </div>
  );

  ExpiredModalMock.displayName = "RaffleExpiredModalMock";
  return ExpiredModalMock;
});

jest.mock("@/components/user/raffles/RafflesFilters", () => {
  const FiltersMock: React.FC = () => (
    <div data-testid="raffle-filters" />
  );

  FiltersMock.displayName = "RafflesFiltersMock";
  return FiltersMock;
});

// ---------- IntersectionObserver ----------
beforeAll(() => {
  class IntersectionObserverMock implements IntersectionObserver {
    root = null;
    rootMargin = "";
    thresholds: ReadonlyArray<number> = [];

    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  Object.defineProperty(global, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
});

// ---------- Tests ----------
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

  it("Renderiza rifas", () => {
    (useFilteredRaffles as jest.Mock).mockReturnValue({
      filteredRaffles: [
        { id: 1, title: "Rifa 1" },
        { id: 2, title: "Rifa 2" },
      ],
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
  });
});
