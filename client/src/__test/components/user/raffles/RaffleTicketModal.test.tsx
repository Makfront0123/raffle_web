import { render, screen, fireEvent } from "@testing-library/react";

import { Ticket } from "@/type/Ticket";
import { Raffle } from "@/type/Raffle";
import { TicketStatusEnum } from "@/type/Payment";
import RaffleTicketModal from "@/components/user/raffles/RaffleTickedModal";

describe("RaffleTicketModal", () => {
  it("ejecuta las acciones del modal correctamente", () => {
    const handleAction = jest.fn();
    const setOpen = jest.fn();


    const ticket: Ticket = {
      id_ticket: 1,
      ticket_number: "55",
      status: TicketStatusEnum.AVAILABLE,
      raffle: {
        id: 0,
        title: "",
        price: 0,
        description: "",
        end_date: "",
        digits: 0,
        status: "",
        tickets: [],
        prizes: [],
        created_at: "",
        total_numbers: 0
      }
    };

    const raffle: Raffle = {
      id: 1,
      price: 5000,
      tickets: [],
      title: "Rifa Test",
      description: "",
      digits: 2,
      status: "active",
      prizes: [],
      total_numbers: 100,
      created_at: new Date().toISOString(),
      end_date: new Date().toISOString(),
    };

  render(
  <RaffleTicketModal
    open={true}
    setOpen={setOpen}
    tickets={[ticket]}
    raffle={raffle}
    handleAction={handleAction}
  />
);


    const payButton = screen.getByRole("button", { name: /pagar/i });
    const reserveButton = screen.getByRole("button", { name: /reservar/i });

    fireEvent.click(payButton);
    fireEvent.click(reserveButton);

    expect(handleAction).toHaveBeenCalledWith("pay");
    expect(handleAction).toHaveBeenCalledWith("reserved");
    expect(handleAction).toHaveBeenCalledTimes(2);
  });
});
