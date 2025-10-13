// src/types/raffle.ts
export interface Raffle {
  id: number;
  title: string;
  price: string;
  total_numbers: number;
  description: string;   // agregar si tu API lo devuelve
  end_date: string;      // agregar si tu API lo devuelve
  digits: number;        // agregar si tu API lo devuelve
  tickets: number;       // agregar si tu API lo devuelve
}
