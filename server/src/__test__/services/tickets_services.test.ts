import { TicketService } from "../../services/ticketService";

describe("TicketService", () => {
    let fakeTicketRepo: any;
    let fakePaymentRepo: any;
    let service: TicketService;
    beforeEach(() => {
        fakeTicketRepo = {
            find: jest.fn(),
            count: jest.fn(),
        };

        fakePaymentRepo = {
            find: jest.fn(),
        };

        service = new TicketService({
            ticket: fakeTicketRepo,
            payment: fakePaymentRepo,
        });
    });
    test("getSoldPercentage devuelve cálculo correcto", async () => {
        fakeTicketRepo.find.mockResolvedValue([
            { status: "available" },
            { status: "reserved" },
            { status: "purchased" },
            { status: "purchased" },
        ]);

        fakeTicketRepo.count
            .mockResolvedValueOnce(4) // total
            .mockResolvedValueOnce(2); // sold

        const result = await service.getSoldPercentage(1);

        expect(result.totalTickets).toBe(4);
        expect(result.soldTickets).toBe(2);
        expect(result.reservedTickets).toBe(1);
        expect(result.availableTickets).toBe(1);
        expect(result.soldPercentage).toBe(50);
    });
    test("getTicketsByUser devuelve tickets de pagos", async () => {
        fakePaymentRepo.find.mockResolvedValue([
            {
                id: 10,
                total_amount: 20000,
                method: "nequi",
                status: "paid",
                created_at: new Date("2025-01-01"),
                raffle: { id: 99, title: "Rifa X", end_date: "2025-10-10" },
                details: [
                    {
                        ticket: {
                            id_ticket: 1,
                            ticket_number: "045",
                            purchased_at: "2025-01-01",
                            status: "purchased",
                        },
                    },
                    {
                        ticket: {
                            id_ticket: 2,
                            ticket_number: "046",
                            purchased_at: "2025-01-01",
                            status: "purchased",
                        },
                    },
                ],
            },
        ]);

        const result = await service.getTicketsByUser(123);

        expect(fakePaymentRepo.find).toHaveBeenCalled();

        expect(result.length).toBe(2);

        expect(result[0]).toMatchObject({
            id_ticket: 1,
            ticket_number: "045",
            status: "purchased",
            payment: {
                id: 10,
                total_amount: 20000,
                method: "nequi",
                status: "paid",
            },
        });
    });
});
