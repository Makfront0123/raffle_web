import { Raffle } from "@/type/Raffle";

export type RaffleStatusFilter = "all" | "pending" | "active" | "ended";

export interface RafflesTableProps {
  raffles: Raffle[];
  loading: boolean;
  error: string | null;

  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;

  statusFilter: RaffleStatusFilter;
  setStatusFilter: (status: RaffleStatusFilter) => void;

  deleteRaffle: (id: number) => void;
  activateRaffle: (id: number) => void;
  deactivateRaffle: (id: number) => void;
  updateRaffle: (id: number, data: Partial<Raffle>) => void;
}
