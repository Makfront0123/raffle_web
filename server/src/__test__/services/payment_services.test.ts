import { PaymentService } from "../../services/paymentService";
import { In } from "typeorm";

jest.mock("typeorm", () => {
  const actual = jest.requireActual("typeorm");
  return {
    ...actual,
    In: jest.fn((v) => v),
  };
});

describe("PaymentService", () => {
  let paymentService: PaymentService;

  let mockDataSource: any;
  let manager: any;

  let mockUserRepo: any;
  let mockRaffleRepo: any;
  let mockTicketRepo: any;
  let mockReservationTicketRepo: any;
  let mockPaymentRepo: any;
  let mockPaymentDetailRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockReservationQB = {
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    mockUserRepo = { findOne: jest.fn() };
    mockRaffleRepo = { findOne: jest.fn() };
    mockTicketRepo = { find: jest.fn(), save: jest.fn() };
    mockReservationTicketRepo = {
      createQueryBuilder: jest.fn(() => mockReservationQB),
      remove: jest.fn(),
    };
    mockPaymentRepo = { create: jest.fn(), save: jest.fn() };
    mockPaymentDetailRepo = { create: jest.fn(), save: jest.fn() };

    manager = {
      getRepository: jest.fn((entity) => {
        switch (entity.name) {
          case "User": return mockUserRepo;
          case "Raffle": return mockRaffleRepo;
          case "Ticket": return mockTicketRepo;
          case "ReservationTicket": return mockReservationTicketRepo;
          case "Payment": return mockPaymentRepo;
          case "PaymentDetail": return mockPaymentDetailRepo;
          default:
            throw new Error(`Repositorio no mockeado: ${entity.name}`);
        }
      }),
    };

    mockDataSource = {
      getRepository: jest.fn((entity) => {
        if (entity.name === "Ticket") return mockTicketRepo;
        if (entity.name === "Payment") return mockPaymentRepo;
      }),
      transaction: jest.fn(async (callback) => callback(manager)),
    };

    paymentService = new PaymentService(mockDataSource);
  });

  test("lanza error si el usuario no existe", async () => {
    mockUserRepo.findOne.mockResolvedValue(null);

    await expect(
      paymentService.createPayment({
        user_id: 1,
        raffle_id: 10,
        ticket_ids: [1, 2],
        reference: "REF-123",
      })
    ).rejects.toThrow("No se encontró el usuario");
  });

  test("lanza error si la rifa no existe", async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 1 });
    mockRaffleRepo.findOne.mockResolvedValue(null);

    await expect(
      paymentService.createPayment({
        user_id: 1,
        raffle_id: 10,
        ticket_ids: [1, 2],
        reference: "REF-123",
      })
    ).rejects.toThrow("No se encontró la rifa");
  });

  test("lanza error si no hay tickets seleccionados", async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 1 });
    mockRaffleRepo.findOne.mockResolvedValue({
      id: 10,
      price: 5000,
      status: "active",
      end_date: new Date(Date.now() + 60_000),
    });

    mockTicketRepo.find.mockResolvedValue([]);

    await expect(
      paymentService.createPayment({
        user_id: 1,
        raffle_id: 10,
        ticket_ids: [99],
        reference: "REF-123",
      })
    ).rejects.toThrow("No hay tickets seleccionados");
  });

  test("procesa un pago exitoso", async () => {
    const user = { id: 1 };
    const raffle = {
      id: 10,
      price: 5000,
      status: "active",
      end_date: new Date(Date.now() + 60_000),
    };


    const tickets = [
      { id_ticket: 1, raffleId: 10, status: "available", ticket_number: 101 },
      { id_ticket: 2, raffleId: 10, status: "available", ticket_number: 102 },
    ];

    mockUserRepo.findOne.mockResolvedValue(user);
    mockRaffleRepo.findOne.mockResolvedValue(raffle);
    mockTicketRepo.find.mockResolvedValue(tickets);

    mockReservationTicketRepo
      .createQueryBuilder()
      .getMany.mockResolvedValue([{ ticket: { id_ticket: 2 } }]);

    mockPaymentRepo.create.mockReturnValue({ id: 999 });
    mockPaymentRepo.save.mockResolvedValue({ id: 999 });

    mockPaymentDetailRepo.create.mockImplementation((x: any) => x);
    mockPaymentDetailRepo.save.mockResolvedValue(true);

    mockReservationTicketRepo.remove.mockResolvedValue(true);

    const res = await paymentService.createPayment({
      user_id: 1,
      raffle_id: 10,
      ticket_ids: [1, 2],
      reference: "REF-123",
    });


    expect(res).toEqual({
      message: "Pago registrado correctamente",
      payment_id: 999,
      total_amount: 10000,
      tickets: [
        { id: 1, number: 101, status: "purchased" },
        { id: 2, number: 102, status: "purchased" },
      ],
    });
  });
});
