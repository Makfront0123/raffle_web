import { useEffect } from "react";
import { useProviderStore } from "@/store/providerStore";
import { AuthStore } from "@/store/authStore";

export const useProviders = () => {
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
  const { user } = AuthStore();

  useEffect(() => {
    if (!user) return;
    fetchProviders();
  }, [user, fetchProviders]);

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
