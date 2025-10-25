import { useEffect } from "react";
import { useProviderStore } from "@/store/providerStore";

export const useProviders = (token: string) => {
    const { providers, fetchProviders, addProvider, loading, error, updateProvider, deleteProvider, getProviderById } = useProviderStore();

    useEffect(() => {
        fetchProviders(token);
    }, [token, fetchProviders]);

    return { providers, addProvider, loading, error, updateProvider, deleteProvider, getProviderById };
};
