import { AppDataSource } from "../../data-source";
import { ProviderService } from "../../services/providerService";

jest.mock("../../data-source", () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

const mockQueryBuilder = () => ({
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
});

const mockRepo = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder()),
});

describe("ProviderService", () => {
    let providerService: ProviderService;
    let providerRepo: any;
    let ticketRepo: any;
    let prizeRepo: any;

    beforeEach(() => {
        jest.clearAllMocks();

        providerRepo = mockRepo();
        ticketRepo = mockRepo();
        prizeRepo = {
            count: jest.fn(),
        };

        (AppDataSource.getRepository as jest.Mock).mockImplementation(
            (entity: any) => {
                if (entity.name === "Provider") return providerRepo;
                if (entity.name === "Ticket") return ticketRepo;
                if (entity.name === "Prize") return prizeRepo;
            }
        );

        providerService = new ProviderService();
    });

    test("getAllProviders: retorna lista", async () => {
        providerRepo.find.mockResolvedValue([{ id: 1 }]);

        const result = await providerService.getAllProviders();

        expect(result).toEqual([{ id: 1 }]);
    });

    test("getProviderById: retorna datos", async () => {
        providerRepo.findOne.mockResolvedValue({ id: 7 });

        const result = await providerService.getProviderById(7);

        expect(result).toEqual({ id: 7 });
    });

    test("createProvider: nombre faltante", async () => {
        await expect(
            providerService.createProvider({ name: "" })
        ).rejects.toThrow("El nombre del proveedor es obligatorio");
    });

    test("createProvider: crea correctamente", async () => {
        const created = { id: 1, name: "Proveedor" };

        providerRepo.create.mockReturnValue(created);
        providerRepo.save.mockResolvedValue(created);

        const result = await providerService.createProvider({
            name: "Proveedor",
        });

        expect(result).toEqual({
            message: "Proveedor creado correctamente",
            data: created,
        });
    });

    test("updateProvider: sin campos válidos", async () => {
        await expect(
            providerService.updateProvider(1, {})
        ).rejects.toThrow("No se enviaron campos válidos para actualizar");
    });

    test("updateProvider: actualiza correctamente", async () => {
        providerRepo.findOne.mockResolvedValue({ id: 1 });
        providerRepo.update.mockResolvedValue({});
        providerRepo.findOne.mockResolvedValue({ id: 1, name: "Nuevo" });

        const result = await providerService.updateProvider(1, {
            name: "Nuevo",
        });

        expect(result.message).toBe("Proveedor actualizado correctamente");
    });
    test("deleteProvider: no existe", async () => {
        providerRepo.findOne.mockResolvedValue(null);

        await expect(providerService.deleteProvider(8)).rejects.toThrow(
            "Proveedor no encontrado"
        );
    });

    test("deleteProvider: tiene premios asociados", async () => {
        providerRepo.findOne.mockResolvedValue({ id: 1 });

        prizeRepo.count.mockResolvedValue(3); // 👈 🔥 importante

        await expect(providerService.deleteProvider(1)).rejects.toThrow(
            "No se puede eliminar el proveedor porque tiene premios asociados"
        );
    });

    test("deleteProvider: elimina correctamente", async () => {
        providerRepo.findOne.mockResolvedValue({ id: 1 });
        prizeRepo.count.mockResolvedValue(0);

        const qb = ticketRepo.createQueryBuilder();
        qb.getCount.mockResolvedValue(0);

        providerRepo.delete.mockResolvedValue({});

        const result = await providerService.deleteProvider(1);

        expect(result).toEqual({
            message: "Proveedor #1 eliminado correctamente",
        });
    });
});
