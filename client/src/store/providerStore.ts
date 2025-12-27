import { create } from "zustand";
import { Providers } from "@/type/Providers";
import { ProviderService } from "@/services/providerService";
import { toast } from "sonner";

interface ProviderStore {
    providers: Providers[];
    loading: boolean;
    error: string | null;
    fetchProviders: (token: string) => Promise<void>;
    addProvider: (provider: Providers, token: string) => Promise<void>;
    getProviderById: (id: number, token: string) => Promise<void>;
    updateProvider: (id: number, provider: Providers, token: string) => Promise<void>;
    deleteProvider: (id: number, token: string) => Promise<boolean>;
}

const getErrorMessage = (err: unknown): string => {
    if (typeof err === "object" && err !== null && "message" in err) {
        return (err as { message: string }).message;
    }
    return "Error desconocido";
};

export const useProviderStore = create<ProviderStore>((set) => ({
    providers: [],
    loading: false,
    error: null,

    fetchProviders: async (token: string) => {
        set({ loading: true, error: null });
        try {
            const service = new ProviderService();
            const data = await service.getAllProviders(token);
            set({ providers: data, loading: false });
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            set({ error: message, loading: false });
            toast.error("Error al cargar proveedores");
        }
    },

    addProvider: async (provider: Providers, token: string) => {
        set((state) => ({ providers: [...state.providers, provider] }));
        try {
            const service = new ProviderService();
            const created = await service.createProvider(provider, token);
            set((state) => ({
                providers: state.providers.map(p => p === provider ? created : p)
            }));
            toast.success("Proveedor agregado correctamente");
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            set({ error: message });
            toast.error("Error al agregar proveedor");
        }
    },

    updateProvider: async (id: number, provider: Providers, token: string) => {
        try {
            const service = new ProviderService();
            const updated = await service.updateProvider(id, provider, token);
            set((state) => ({
                providers: state.providers.map(p => p.id === id ? updated : p)
            }));
            toast.success("Proveedor actualizado correctamente");
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            set({ error: message });
        }
    },

    deleteProvider: async (id: number, token: string) => {
        try {
            const service = new ProviderService();
            await service.deleteProvider(id, token);
            set((state) => ({ providers: state.providers.filter(p => p.id !== id) }));
            toast.success("Proveedor eliminado correctamente");
            return true;
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            set({ error: message });
            toast.error(message || "Error al eliminar proveedor");
            return false;
        }
    },

    getProviderById: async (id: number, token: string) => {
        try {
            const service = new ProviderService();
            const provider = await service.getProviderById(id, token);
            set({ providers: [provider] });
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            set({ error: message });
            toast.error(message || "Error al obtener proveedor");
        }
    },
}));
