"use client";

import { useState } from "react";
import { AuthStore } from "@/store/authStore";
import { Providers } from "@/type/Providers";
import { useProviders } from "./useProviders";
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
  const [form, setForm] = useState<Providers>({
    name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
  });

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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (form.id) {
        const { id, name, contact_name, contact_email, contact_phone } = form;
        const data = { name, contact_name, contact_email, contact_phone };
        await updateProvider(id, data);
      } else {
        await addProvider(form);
      }

      await fetchProviders();
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Error guardando proveedor:", err);
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
    } catch (err) {
      console.error("Error eliminando proveedor:", err);
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
  };
};
