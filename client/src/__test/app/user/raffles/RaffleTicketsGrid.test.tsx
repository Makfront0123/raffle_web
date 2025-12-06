import RaffleTicketsGrid from "@/components/user/raffles/RaffleTicketsGrid";
import { render, screen, fireEvent } from "@testing-library/react";


describe("RaffleTicketsGrid", () => {
    it("renderiza tickets correctamente y detecta click", () => {
        const tickets = [
            { id_ticket: 1, ticket_number: 10, status: "available" },
        ];

        const getColor = jest.fn(() => "bg-green-200");
        const handleSelect = jest.fn();

        render(
            <RaffleTicketsGrid
                tickets={tickets}
                getColor={getColor}
                handleSelect={handleSelect}
            />
        );

        const ticket = screen.getByTestId("ticket-item");
        fireEvent.click(ticket);

        expect(handleSelect).toHaveBeenCalledTimes(1);
    });
});
