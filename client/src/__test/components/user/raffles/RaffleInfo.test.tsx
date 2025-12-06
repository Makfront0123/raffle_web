import RaffleInfo from "@/components/user/raffles/RaffleInfo";
import { render, screen } from "@testing-library/react";
 

describe("RaffleInfo", () => {
  it("renderiza información básica de la rifa", () => {
    const mockRaffle = {
      title: "Rifa de prueba",
      description: "Descripción",
      total_numbers: 100,
      price: 5000,
      end_date: "2025-01-01T00:00:00",
    };

    render(<RaffleInfo raffle={mockRaffle} soldPercentage={30} />);

    expect(screen.getByText("Rifa de prueba")).toBeInTheDocument();
    expect(screen.getByText("Descripción")).toBeInTheDocument();
    expect(screen.getByText(/Total tickets/)).toBeInTheDocument();
    expect(screen.getByText(/Precio por ticket/)).toBeInTheDocument();
    expect(screen.getByText(/Progreso de venta: 30.00%/)).toBeInTheDocument();
  });
});
