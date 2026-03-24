"use client";

import { useState } from "react";
import { AuthStore } from "@/store/authStore";
import { Providers } from "@/type/Providers";
import { useProviders } from "./useProviders";
import { useZodForm } from "./useZodForm";
import { ProviderFormValues, providerSchema } from "@/lib/schemas/provider.schema";
import { handleApiError } from "@/helper/handleApiError";
import { toast } from "sonner";
export interface ProviderFormState {
  id?: number;
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}
export const useProvidersLogic = () => {
  const { user } = AuthStore();
  const {
    providers,
    loading,
    error,
    addProvider,
    updateProvider,
    deleteProvider,
    fetchProviders,
  } = useProviders();

  const [open, setOpen] = useState(false);

  const {
    form,
    setForm,
    handleChange,
    validate,
    errors,
  } = useZodForm<ProviderFormValues>(
    {
      name: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
    },
    providerSchema
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<Providers | null>(null);

  const resetForm = () => {
    setForm({
      name: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validate()) return;

    try {
      if (form.id) {
        const { id, ...data } = form;
        await updateProvider(id, data);
        toast.success("Proveedor actualizado correctamente");
      } else {
        await addProvider(form);
        toast.success("Proveedor agregado correctamente");
      }

      await fetchProviders();
      resetForm();
      setOpen(false);

    } catch (err) {
      handleApiError(err, "Error guardando proveedor");
    }
  };
  const handleEdit = (id: number) => {
    const provider = providers.find((p) => p.id === id);
    if (!provider) return;
    setForm(provider);
    setOpen(true);
  };
  const requestDeleteProvider = (id: number) => {
    const provider = providers.find((p) => p.id === id) || null;
    setProviderToDelete(provider);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProvider = async () => {
    if (!user || !providerToDelete?.id) return;

    try {
      await deleteProvider(providerToDelete.id);
      await fetchProviders();
      toast.success("Proveedor eliminado correctamente");

    } catch (err) {
      handleApiError(err, "Error eliminando proveedor");

    } finally {
      setDeleteDialogOpen(false);
      setProviderToDelete(null);
    }
  };

  return {
    providers,
    loading,
    error,
    open,
    setOpen,
    form,
    handleChange,
    handleSubmit,
    handleEdit,
    deleteDialogOpen,
    setDeleteDialogOpen,
    providerToDelete,
    requestDeleteProvider,
    confirmDeleteProvider,
    errors,
  };
};