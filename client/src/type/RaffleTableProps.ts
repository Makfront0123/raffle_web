import { Raffle } from "@/type/Raffle";

export interface RafflesTableProps {
  raffles: Raffle[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  deleteRaffle: (id: number) => void;
  activateRaffle: (id: number) => void;
  deactivateRaffle: (id: number) => void;
  updateRaffle: (id: number, data: Partial<Raffle>) => void;
}
