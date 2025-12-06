import axios from "axios";
import { PrizeService } from "@/services/prizeService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock global fetch
global.fetch = jest.fn();

describe("PrizeService", () => {
    const service = new PrizeService();

    it("getAllPrizes retorna premios", async () => {
        mockedAxios.get.mockResolvedValue({ data: [{ id: 1 }] });

        const res = await service.getAllPrizes("t");

        expect(res[0].id).toBe(1);
    });

    it("getPrizeById obtiene un premio", async () => {
        mockedAxios.get.mockResolvedValue({ data: { id: 50 } });

        const res = await service.getPrizeById(50, "token");

        expect(res.id).toBe(50);
    });

    it("createPrize retorna BackendResponse", async () => {
        mockedAxios.post.mockResolvedValue({
            data: { message: "ok", data: { id: 5 } },
        });

        const dto = {
            name: "TV",
            description: "LCD",
            value: 1000,
            type: "electronic",
            raffleId: 1,
            providerId: 1,
        };

        const res = await service.createPrize(dto, "token");

        expect(res.data.id).toBe(5);
    });


    it("updatePrize retorna BackendResponse", async () => {
        mockedAxios.patch.mockResolvedValue({
            data: { message: "updated", data: { id: 3 } },
        });

        const res = await service.updatePrize(
            3,
            { name: "Nuevo" },
            "token"
        );

        expect(res.message).toBe("updated");
    });

    it("getWinners usa fetch y retorna lista", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([{ id: 1 }]),
        });

        const res = await service.getWinners(10, "token");

        expect(res.length).toBe(1);
    });

    it("deletePrize envía DELETE", async () => {
        mockedAxios.delete.mockResolvedValue({ data: { message: "deleted" } });

        const res = await service.deletePrize(10, "t");

        expect(res.message).toBe("deleted");
    });
});
