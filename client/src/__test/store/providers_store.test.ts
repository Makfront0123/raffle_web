import { act } from "@testing-library/react";
import { useProviderStore } from "@/store/providerStore";
import { ProviderService } from "@/services/providerService";

jest.mock("sonner", () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));

// ------- MOCK COMPLETO DE PROVIDER --------
const fullProvider = {
    id: 1,
    name: "Proveedor 1",
    contact_name: "Juan",
    contact_email: "juan@test.com",
    contact_phone: "123456",
};

describe("ProviderStore", () => {
    beforeEach(() => {
        useProviderStore.setState({
            providers: [],
            loading: false,
            error: null,
        });
    });

    // ---------------------------------------------------

    it("fetchProviders carga proveedores", async () => {
        jest
            .spyOn(ProviderService.prototype, "getAllProviders")
            .mockResolvedValue([fullProvider]);

        await act(async () => {
            await useProviderStore.getState().fetchProviders("token");
        });

        expect(useProviderStore.getState().providers.length).toBe(1);
    });

    // ---------------------------------------------------

    it("addProvider agrega proveedor", async () => {
        const newProvider = {
            id: 80,
            name: "Nuevo",
            contact_name: "Pedro",
            contact_email: "pedro@test.com",
            contact_phone: "999999",
        };

        jest
            .spyOn(ProviderService.prototype, "createProvider")
            .mockResolvedValue(newProvider);

        await act(async () => {
            await useProviderStore.getState().addProvider(
                newProvider,
                "token"
            );
        });

        expect(useProviderStore.getState().providers[0].id).toBe(80);
    });

    // ---------------------------------------------------

    it("deleteProvider elimina proveedor", async () => {
        useProviderStore.setState({
            providers: [fullProvider],
        });

        jest
            .spyOn(ProviderService.prototype, "deleteProvider")
            .mockResolvedValue(undefined); 

        await act(async () => {
            await useProviderStore.getState().deleteProvider(1, "token");
        });

        expect(useProviderStore.getState().providers.length).toBe(0);
    });

});
