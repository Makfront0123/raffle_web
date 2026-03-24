"use client";

import { ProvidersDeleteModal } from "@/components/admin/providers/ProvidersDeleteModal";
import { ProvidersEditModal } from "@/components/admin/providers/ProvidersEditModal";
import { ProvidersForm } from "@/components/admin/providers/ProvidersForm";
import { ProvidersTable } from "@/components/admin/providers/ProvidersTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


import { useProvidersLogic } from "@/hook/useProviderLogic";

export default function ProvidersPage() {
  const {
    providers,
    loading,
    error,
    errors,
    form,
    handleChange,
    handleSubmit,
    handleEdit,
    requestDeleteProvider,
    confirmDeleteProvider,
    open,
    setOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    providerToDelete
  } = useProvidersLogic();

  return (
    <main className="p-6 bg-gray-50 flex-1">
      <h1 className="text-3xl font-bold mb-6">Proveedores</h1>
      <Card className="mb-6 border-none shadow-lg">
        <CardHeader>
          <CardTitle>Agregar Nuevo Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <ProvidersForm form={form} onChange={handleChange} onSubmit={handleSubmit} errors={errors} />
        </CardContent>
      </Card>
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Proveedores Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <ProvidersTable
            providers={providers}
            onEdit={handleEdit}
            onDelete={requestDeleteProvider}
          />
        </CardContent>
      </Card>

      <ProvidersEditModal
        open={open}
        onOpenChange={setOpen}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <ProvidersDeleteModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        provider={providerToDelete}
        onConfirm={confirmDeleteProvider}
      />
    </main>
  );
}

