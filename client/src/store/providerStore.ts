import { create } from "zustand";
import { Providers } from "@/type/Providers";
import { ProviderService } from "@/services/providerService";
import { toast } from "sonner";

interface ProviderStore {
    providers: Providers[];
    loading: boolean;
    error: string | null;

    fetchProviders: () => Promise<void>;
    getProviderById: (id: number) => Promise<Providers>;

    addProvider: (provider: Providers) => Promise<Providers>;
    updateProvider: (id: number, provider: Providers) => Promise<Providers>;
    deleteProvider: (id: number) => Promise<void>;
}
export const useProviderStore = create<ProviderStore>((set) => ({
    providers: [],
    loading: false,
    error: null,

    fetchProviders: async () => {
        set({ loading: true, error: null });
        try {
            const service = new ProviderService();
            const data = await service.getAllProviders();
            set({ providers: data, loading: false });
        } catch (err: unknown) {
            throw err;
        }
    },

    addProvider: async (provider: Providers) => {
        try {
            const service = new ProviderService();
            const created = await service.createProvider(provider);

            set((state) => ({
                providers: [...state.providers, created]
            }));

            return created;
        } catch (err: unknown) {
            throw err;
        }
    },

    updateProvider: async (id: number, provider: Providers) => {
        try {
            const service = new ProviderService();
            const updated = await service.updateProvider(id, provider);
            set((state) => ({
                providers: state.providers.map(p => p.id === id ? updated : p)
            }));
            return updated;
        } catch (err: unknown) {
            throw err;
        }
    },

    deleteProvider: async (id: number) => {
        try {
            const service = new ProviderService();
            await service.deleteProvider(id);

            set((state) => ({
                providers: state.providers.filter((p) => p.id !== id),
            }));

        } catch (err: unknown) {
            throw err;
        }
    },

    getProviderById: async (id: number) => {
        try {
            const service = new ProviderService();
            const provider = await service.getProviderById(id);
            set({ providers: [provider] });
            return provider;
        } catch (err: unknown) {
            throw err;
        }
    },
}));
