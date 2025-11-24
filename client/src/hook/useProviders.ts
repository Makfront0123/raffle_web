import { useEffect } from "react";
import { useProviderStore } from "@/store/providerStore";

export const useProviders = (token: string) => {
  const {
    providers,
    fetchProviders,
    addProvider,
    loading,
    error,
    updateProvider,
    deleteProvider,
    getProviderById,
  } = useProviderStore();

  useEffect(() => {
    if (!token) return;
    fetchProviders(token);
  }, [token, fetchProviders]);

  return {
    providers,
    loading,
    error,
    addProvider,
    updateProvider,
    deleteProvider,
    getProviderById,
    fetchProviders,
  };
};
