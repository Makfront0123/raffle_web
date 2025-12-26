import RaffleTicketModal from "@/components/user/raffles/RaffleTickedModal";
import { Raffle } from "@/type/Raffle";
import { Ticket } from "@/type/Ticket";
import { render, screen, fireEvent } from "@testing-library/react";

describe("RaffleTicketModal", () => {
  it("ejecuta las acciones del modal", () => {
    const handleAction = jest.fn();
    const setOpen = jest.fn();

    const ticket = {
      ticket_number: "55",
      status: "available",
    };

    const raffle = {
      price: 5000,
    };

    render(
      <RaffleTicketModal
        open={true}
        setOpen={setOpen}
        ticket={ticket as Ticket}
        raffle={raffle as Raffle}
        handleAction={handleAction}
      />
    );

    fireEvent.click(screen.getByText("Pagar"));
    fireEvent.click(screen.getByText("Reservar Ticket"));

    expect(handleAction).toHaveBeenCalledWith("pay");
    expect(handleAction).toHaveBeenCalledWith("reserved");
    expect(handleAction).toHaveBeenCalledTimes(2);
  });
});
