import RaffleTicketsGrid from "@/components/user/raffles/RaffleTicketsGrid";
import { TicketStatusEnum } from "@/type/Payment";
import { Ticket } from "@/type/Ticket";
import { render, screen, fireEvent } from "@testing-library/react";

describe("RaffleTicketsGrid", () => {
    it("renderiza tickets correctamente y detecta click", () => {
        const tickets: Ticket[] = [
            {
                id_ticket: 1, ticket_number: "10", status: TicketStatusEnum.AVAILABLE,
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
                },
            }
        ];

        const selectedTickets: Ticket[] = [];

        const getColor = jest.fn(() => "bg-green-200");
        const handleSelect = jest.fn();

        render(
            <RaffleTicketsGrid
                tickets={tickets}
                selectedTickets={selectedTickets}
                getColor={getColor}
                handleSelect={handleSelect}
            />
        );

        const ticket = screen.getByTestId("ticket-item");
        fireEvent.click(ticket);

        expect(handleSelect).toHaveBeenCalledTimes(1);
    });
});
