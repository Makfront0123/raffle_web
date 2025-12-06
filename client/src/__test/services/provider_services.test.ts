import axios from "axios";

import { Providers } from "@/type/Providers";
import { ProviderService } from "@/services/providerService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProviderService", () => {
    const service = new ProviderService();
    const token = "123";

    const providerMock: Providers = {
        id: 1,
        name: "Proveedor Test",
        contact_phone: "12345",
        contact_email: "test@mail.com",
        contact_name: "Test",
    };

    it("getAllProviders → retorna lista de providers", async () => {
        mockedAxios.get.mockResolvedValue({ data: [providerMock] });

        const res = await service.getAllProviders(token);

        expect(res).toEqual([providerMock]);
        expect(mockedAxios.get).toHaveBeenCalled();
    });

    it("getProviderById → retorna un provider", async () => {
        mockedAxios.get.mockResolvedValue({ data: providerMock });

        const res = await service.getProviderById(1, token);

        expect(res).toEqual(providerMock);
    });

    it("createProvider → retorna provider creado", async () => {
        mockedAxios.post.mockResolvedValue({ data: providerMock });

        const res = await service.createProvider(providerMock, token);

        expect(res).toEqual(providerMock);
    });

    it("updateProvider → retorna provider actualizado", async () => {
        const updated = { ...providerMock, name: "Nuevo Nombre" };

        mockedAxios.put.mockResolvedValue({ data: updated });

        const res = await service.updateProvider(1, updated, token);

        expect(res).toEqual(updated);
    });

    it("deleteProvider → retorna void", async () => {
        mockedAxios.delete.mockResolvedValue({ data: undefined });

        const res = await service.deleteProvider(1, token);

        expect(res).toBeUndefined();
    });

    it("deleteProvider → lanza error si backend falla", async () => {
        mockedAxios.delete.mockRejectedValue({
            response: { data: { message: "Error desde backend" } },
        });

        await expect(service.deleteProvider(1, token)).rejects.toThrow(
            "Error desde backend"
        );
    });
});
