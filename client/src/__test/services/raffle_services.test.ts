import axios from "axios";

import { Raffle } from "@/type/Raffle";
import { RaffleService } from "@/services/raffleService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("RaffleService tests", () => {
    const service = new RaffleService();
    const token = "abc";

    const raffleMock: Raffle = {
        id: 1,
        title: "Rifa 1",
        description: "Descripción",
        total_numbers: 100,
        digits: 3,
        price: 5000,
        status: "active",
        created_at: "2024-01-01",
        end_date: "2024-01-01",
        prizes: [],
        tickets: [],
    };

    it("getAllRaffles → retorna lista", async () => {
        mockedAxios.get.mockResolvedValue({ data: [raffleMock] });

        const res = await service.getAllRaffles(token);

        expect(res).toEqual([raffleMock]);
    });

    it("getRaffleById → retorna una rifa", async () => {
        mockedAxios.get.mockResolvedValue({ data: raffleMock });

        const res = await service.getRaffleById(1, token);

        expect(res).toEqual(raffleMock);
    });

    it("createRaffle → retorna creada", async () => {
        mockedAxios.post.mockResolvedValue({ data: raffleMock });

        const res = await service.createRaffle(raffleMock, token);

        expect(res).toEqual(raffleMock);
    });

    it("updateRaffle → retorna actualizada", async () => {
        const updated = { ...raffleMock, name: "Nueva Rifa" };

        mockedAxios.patch.mockResolvedValue({ data: updated });

        const res = await service.updateRaffle(1, updated, token);

        expect(res).toEqual(updated);
    });

    it("deleteRaffle → retorna void", async () => {
        mockedAxios.delete.mockResolvedValue({});

        const res = await service.deleteRaffle(1, token);

        expect(res).toBeUndefined();
    });

    it("regenerateTickets → retorna void", async () => {
        mockedAxios.put.mockResolvedValue({});

        const res = await service.regenerateTickets(1, 4, token);

        expect(res).toBeUndefined();
    });

    it("activateRaffle → retorna void", async () => {
        mockedAxios.put.mockResolvedValue({});

        const res = await service.activateRaffle(1, token);

        expect(res).toBeUndefined();
    });

    it("deactivateRaffle → retorna void", async () => {
        mockedAxios.put.mockResolvedValue({});

        const res = await service.deactivateRaffle(1, token);

        expect(res).toBeUndefined();
    });
});
