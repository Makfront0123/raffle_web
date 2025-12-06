import RaffleTicketModal from "@/components/user/raffles/RaffleTickedModal";
import { render, screen, fireEvent } from "@testing-library/react";


describe("RaffleTicketModal", () => {
    it("ejecuta las acciones del modal", () => {
        const handleAction = jest.fn();
        const setOpen = jest.fn();

        const ticket = { ticket_number: 55 };
        const raffle = { price: 5000 };

        render(
            <RaffleTicketModal
                open={true}
                setOpen={setOpen}
                ticket={ticket}
                raffle={raffle}
                handleAction={handleAction}
            />
        );

        fireEvent.click(screen.getByText("Pagar con Nequi"));
        fireEvent.click(screen.getByText("Pagar con Daviplata"));
        fireEvent.click(screen.getByText("Reservar Ticket"));

        expect(handleAction).toHaveBeenCalledTimes(3);
    });
});
