/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import React from "react";
import RaffleInfo from "@/components/user/raffles/RaffleInfo";
import { Raffle } from "@/type/Raffle";

describe("RaffleInfo", () => {
  it("renderiza información básica de la rifa", () => {
    const mockRaffle: Raffle = {
      id: 1,
      title: "Rifa de prueba",
      description: "Descripción",
      total_numbers: 100,
      price: 5000,
      status: "active",
      tickets: [],
      end_date: "2025-01-01T00:00:00",
      digits: 0,
      prizes: [],
      created_at: ""
    };


    render(<RaffleInfo raffle={mockRaffle} soldPercentage={30} />);


    expect(screen.getByText("Rifa de prueba")).toBeInTheDocument();
    expect(screen.getByText("Descripción")).toBeInTheDocument();

    expect(screen.getByText(/Total tickets/)).toBeInTheDocument();
    expect(screen.getByText(/Precio por ticket/)).toBeInTheDocument();


    expect(screen.getByText("Progreso de ventas")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("muestra el mensaje de últimos tickets cuando soldPercentage >= 80", () => {
    const mockRaffle: Raffle = {
      id: 1,
      title: "Rifa de prueba",
      description: "Descripción",
      total_numbers: 100,
      price: 5000,
      status: "active",
      tickets: [],
      end_date: "2025-01-01T00:00:00",
      digits: 0,
      prizes: [],
      created_at: ""
    };

    render(<RaffleInfo raffle={mockRaffle} soldPercentage={85} />);

    expect(screen.getByText("⚡ ¡Últimos tickets disponibles!")).toBeInTheDocument();
  });
});
