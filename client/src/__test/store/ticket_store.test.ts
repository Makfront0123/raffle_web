import { act } from "@testing-library/react";
import { useTicketStore } from "@/store/ticketStore";
import { TicketService } from "@/services/ticketService";
import { Payment, TicketStatusEnum } from "@/type/Payment";
import { Ticket } from "lucide-react";

jest.mock("@/services/ticketService");

describe("TicketStore", () => {
  beforeEach(() => {
    useTicketStore.setState({ tickets: [], soldPercentage: 0 });
    jest.clearAllMocks();
  });

  const mockTicket = {
    id_ticket: 1,
    ticket_number: "001",
    status: TicketStatusEnum.AVAILABLE,
    purchased_at: null,
    raffle: { id: 50, title: "Rifa" },
    payment: {} as Payment,
  };

  it("getTickets carga tickets", async () => {
    (TicketService.getTickets as jest.Mock).mockResolvedValue([mockTicket]);

    await act(async () => {
      await useTicketStore.getState().getTickets("token");
    });

    expect(useTicketStore.getState().tickets.length).toBe(1);
  });

  it("getSoldPercentage actualiza porcentaje vendido", async () => {
    (TicketService.getSoldPercentage as jest.Mock).mockResolvedValue({ soldPercentage: 75 });

    await act(async () => {
      await useTicketStore.getState().getSoldPercentage(10, "token");
    });

    expect(useTicketStore.getState().soldPercentage).toBe(75);
  });
});
