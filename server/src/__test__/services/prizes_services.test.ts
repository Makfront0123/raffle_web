 
import { AppDataSource } from "../../data-source";
import { PrizesService } from "../../services/prizesService";

jest.mock("../../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  getMany: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  }),
});

describe("PrizesService", () => {
  let prizesService: PrizesService;

  let prizeRepo: any;
  let ticketRepo: any;
  let paymentRepo: any;
  let paymentDetailRepo: any;
  let providerRepo: any;
  let raffleRepo: any;

  const mockGetRepo = (repo: any) =>
    (AppDataSource.getRepository as jest.Mock).mockReturnValueOnce(repo);

  beforeEach(() => {
    jest.clearAllMocks();

    prizeRepo = mockRepo();
    ticketRepo = mockRepo();
    paymentRepo = mockRepo();
    paymentDetailRepo = mockRepo();
    providerRepo = mockRepo();
    raffleRepo = mockRepo();

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity: any) => {
      if (entity.name === "Prize") return prizeRepo;
      if (entity.name === "Ticket") return ticketRepo;
      if (entity.name === "Payment") return paymentRepo;
      if (entity.name === "PaymentDetail") return paymentDetailRepo;
      if (entity.name === "Provider") return providerRepo;
      if (entity.name === "Raffle") return raffleRepo;
    });

    prizesService = new PrizesService();
  });

  test("getAllPrizes: retorna lista", async () => {
    prizeRepo.find.mockResolvedValue([{ id: 1 }]);

    const result = await prizesService.getAllPrizes();

    expect(result).toEqual([{ id: 1 }]);
    expect(prizeRepo.find).toHaveBeenCalled();
  });

  test("getPrizeById: retorna null si id inválido", async () => {
    const result = await prizesService.getPrizeById(0);
    expect(result).toBeNull();
  });

  test("getPrizeById: retorna premio", async () => {
    prizeRepo.findOne.mockResolvedValue({ id: 5 });
    const result = await prizesService.getPrizeById(5);
    expect(result).toEqual({ id: 5 });
  });


  test("createPrize: providerId no existe", async () => {
    providerRepo.findOneBy.mockResolvedValue(null);

    const result = await prizesService.createPrize({
      name: "TV",
      providerId: 99,
    });

    expect(result).toBeNull();
  });

  test("createPrize: raffleId no existe", async () => {
    providerRepo.findOneBy.mockResolvedValue({ id: 3 });
    raffleRepo.findOneBy.mockResolvedValue(null);

    const result = await prizesService.createPrize({
      name: "TV",
      providerId: 3,
      raffleId: 88,
    });

    expect(result).toBeNull();
  });

  test("createPrize: crea correctamente", async () => {
    providerRepo.findOneBy.mockResolvedValue({ id: 1 });
    raffleRepo.findOneBy.mockResolvedValue({ id: 2 });

    const created = { id: 10, name: "TV" };

    prizeRepo.create.mockReturnValue(created);
    prizeRepo.save.mockResolvedValue(created);

    const result = await prizesService.createPrize({
      name: "TV",
      providerId: 1,
      raffleId: 2,
    });

    expect(result).toEqual({
      message: "Premio creado correctamente",
      data: created,
    });
  });


  test("updatePrize: premio no encontrado", async () => {
    prizeRepo.findOne.mockResolvedValue(null);

    await expect(prizesService.updatePrize(1, {}))
      .rejects.toThrow("Premio no encontrado");
  });

  test("updatePrize: provider no existe", async () => {
    prizeRepo.findOne.mockResolvedValue({ id: 1 });
    providerRepo.findOneBy.mockResolvedValue(null);

    await expect(
      prizesService.updatePrize(1, { providerId: 99 })
    ).rejects.toThrow("Proveedor no encontrado");
  });

  test("updatePrize: actualiza correctamente", async () => {
    const prize = { id: 1, name: "Old" };

    prizeRepo.findOne.mockResolvedValue(prize);
    providerRepo.findOneBy.mockResolvedValue({ id: 5 });

    prizeRepo.save.mockResolvedValue({ id: 1, name: "New" });

    const result = await prizesService.updatePrize(1, {
      name: "New",
      providerId: 5,
    });

    expect(result).toEqual({
      message: "Premio actualizado correctamente",
      data: { id: 1, name: "New" },
    });
  });


  test("deletePrize: no existe", async () => {
    prizeRepo.findOne.mockResolvedValue(null);

    await expect(prizesService.deletePrize(9))
      .rejects.toThrow("Premio no encontrado");
  });

  test("deletePrize: rifa activa", async () => {
    prizeRepo.findOne.mockResolvedValue({
      raffle: { status: "active", tickets: [] },
    });

    await expect(prizesService.deletePrize(1))
      .rejects.toThrow("No se puede eliminar el premio porque la rifa está activa");
  });

  test("deletePrize: ya tiene ganador", async () => {
    prizeRepo.findOne.mockResolvedValue({
      raffle: { status: "closed", tickets: [] },
      winner_ticket: { id_ticket: 99 },
    });

    await expect(prizesService.deletePrize(1))
      .rejects.toThrow("No se puede eliminar el premio porque tiene un ticket ganador asociado");
  });

  test("deletePrize: tickets purchased", async () => {
    prizeRepo.findOne.mockResolvedValue({
      raffle: {
        status: "closed",
        tickets: [{ status: "purchased" }],
      },
      winner_ticket: null,
    });

    await expect(prizesService.deletePrize(1))
      .rejects.toThrow("No se puede eliminar el premio porque tiene tickets comprados asociados");
  });

  test("deletePrize: elimina correctamente", async () => {
    prizeRepo.findOne.mockResolvedValue({
      raffle: { status: "closed", tickets: [] },
      winner_ticket: null,
    });

    const result = await prizesService.deletePrize(5);

    expect(result).toEqual({
      message: "Premio #5 eliminado correctamente",
    });
  });

  test("selectWinner: premio no encontrado", async () => {
    prizeRepo.findOne.mockResolvedValue(null);

    await expect(prizesService.selectWinner(1))
      .rejects.toThrow("Premio no encontrado");
  });

  test("selectWinner: sin tickets comprados", async () => {
    prizeRepo.findOne.mockResolvedValue({
      raffle: { tickets: [] },
    });

    await expect(prizesService.selectWinner(1))
      .rejects.toThrow("No hay tickets comprados para esta rifa");
  });

  test("selectWinner: selecciona ganador", async () => {
    prizeRepo.findOne.mockResolvedValue({
      id: 1,
      name: "TV",
      raffle: {
        tickets: [{ id_ticket: 10, status: "purchased", ticket_number: 15 }],
      },
    });

    paymentDetailRepo.findOne.mockResolvedValue({
      payment: { user: { id: 1, name: "Armando", email: "a@mail.com" } },
    });

    prizeRepo.save.mockResolvedValue({});

    const result = await prizesService.selectWinner(1);

    expect(result.prizeId).toBe(1);
    expect(result.winnerTicket.user.name).toBe("Armando");
  });


  test("getWinners: retorna datos formateados", async () => {
    const qb = prizeRepo.createQueryBuilder();
    qb.getRawMany.mockResolvedValue([
      {
        prize_id: 1,
        prize_name: "TV",
        prize_type: "electro",
        prize_value: 1000,
        raffle_id: 5,
        raffle_title: "Rifa",
        winner_ticket: 123,
        user_name: "Juan",
        user_email: "j@mail.com",
      },
    ]);

    const result = await prizesService.getWinners();

    expect(result[0].prize_id).toBe(1);
    expect(result[0].winner_user).toBe("Juan (j@mail.com)");
  });
});
