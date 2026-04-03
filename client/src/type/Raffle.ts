import { RaffleFormValues } from "@/lib/schemas/raffle.schema";
import { Prizes } from "./Prizes";
import { Ticket } from "./Ticket";

export interface Raffle {
  id: number;
  title: string;
  price: number;
  description: string;
  end_date: string;
  digits: number;
  status: string;
  tickets: Ticket[];
  prizes: Prizes[];
  created_at: string;
  total_numbers: number;
}

export interface DashboardData {
  stats: {
    totalRaffles: number;
    activeRaffles: number;
    totalPayments: number;
    totalRevenue: number;
    totalPrizes: number;
    totalWinners: number;
  };
  lastRaffles: Raffle[];
  revenueData: { date: string; total: number }[];
}
export interface DashboardStats {
  stats: { title: string; value: string | number }[];
  lastRaffles: Raffle[];
  revenueData: { date: string; revenue: number }[];
  raffleStatusData: { name: string; value: number }[];
  loading: boolean;
}

export type RaffleForm = {
  title: string;
  description: string;
  price: string;
  end_date: string;
  digits: number;
  status: string;
  tickets: Ticket[];
  prizes: Prizes[];
};


export type UpdateRafflePayload = {
  price?: number;
  endDate?: string;
  title?: string;
  description?: string;
}

export interface CreateRaffleDTO {
  title: string;
  description?: string;
  price: number;
  endDate?: string;
  digits?: number;
}



export const initialForm: RaffleFormValues = {
  title: "",
  description: "",
  price: "8",
  end_date: "",
  digits: 3,
  status: "active",
  tickets: [],
  prizes: [],
};