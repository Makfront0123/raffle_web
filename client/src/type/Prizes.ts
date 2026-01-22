import { Providers } from "./Providers";
import { Raffle } from "./Raffle";
import { Ticket } from "./Ticket";


export interface Prizes {
  id: number;
  name: string;
  description: string;
  value: number;
  type: string;
  created_at: string;
  provider: {
    id: number;
    name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
  };
  raffle: {
    id: number;
    title: string;
  };
  winner_ticket?: Ticket | null;
}

export interface PrizeForm {
  name: string;
  description: string;
  value: number;
  raffle: string;
  provider: string;
  type?: string;
}

export interface CreatePrizeDTO {
  name: string;
  description: string;
  value: number;
  type: string;
  raffleId: number;
  providerId: number;
}


export type PrizeType = "product" | "cash" | "trip";
export interface PrizeFormValues {
  name: string;
  description: string;
  value: number;
  raffle: string;
  provider: string;
  type: PrizeType;
}

export interface PrizeFormProps {
  raffles: Raffle[];
  providers: Providers[];
  loadingRaffles: boolean;
  loadingProviders: boolean;
  onSubmit: (values: PrizeFormValues) => Promise<void>;
}


export interface PrizesTableProps {
  prizes: Prizes[];
  raffles: Raffle[];

  selectedRaffle: number | "all";
  onRaffleChange: (value: number | "all") => void;

  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;

  onUpdate: (id: number, prize: Partial<Prizes>) => void;
  onDelete: (id: number) => void;
}
