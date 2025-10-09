
export class ProviderService {
    async getAllProviders(): Promise<Provider[]> {
        const response = await fetch("/api/providers");
        if (!response.ok) {
            throw new Error("Error obteniendo proveedores");
        }
        const providers = await response.json();
        return providers;
    }
}