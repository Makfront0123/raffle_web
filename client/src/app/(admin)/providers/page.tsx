// src/app/(admin)/providers/page.tsx
"use client";

import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

import { Providers } from "@/type/Providers";
import { useProvidersLogic } from "@/hook/useProviderLogic";

const ProvidersPage = () => {
  const {
    providers,
    loading,
    error,
    open,
    setOpen,
    form,
    handleChange,
    handleSubmit,
    handleEdit,

    // delete flow
    deleteDialogOpen,
    setDeleteDialogOpen,
    providerToDelete,
    requestDeleteProvider,
    confirmDeleteProvider,
  } = useProvidersLogic();

  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Proveedores</h1>

      {/* Formulario inline para crear rápido */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Agregar Nuevo Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="name">Nombre del Proveedor</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_name">Nombre de Contacto</Label>
              <Input
                id="contact_name"
                name="contact_name"
                value={form.contact_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_email">Email de Contacto</Label>
              <Input
                type="email"
                id="contact_email"
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={form.contact_phone}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit">
              {form.id ? "Actualizar Proveedor" : "Agregar Proveedor"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Proveedores Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Cargando proveedores...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {providers.length === 0 ? (
            <p>No hay proveedores registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Contacto</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Teléfono</th>
                    <th className="px-4 py-2 text-left">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p: Providers) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.contact_name}</td>
                      <td className="px-4 py-2">{p.contact_email}</td>
                      <td className="px-4 py-2">{p.contact_phone}</td>

                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <Button
                            className="bg-green-500"
                            onClick={() => handleEdit(p.id!)}
                          >
                            Editar
                          </Button>
                          <Button
                            className="bg-red-500"
                            onClick={() => requestDeleteProvider(p.id!)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal reutilizando el mismo form (para edición) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {form.id ? "Editar Proveedor" : "Agregar Proveedor"}
            </DialogTitle>
            <DialogDescription>
              {form.id
                ? "Modifica la información del proveedor existente."
                : "Completa los datos para registrar un nuevo proveedor."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
            <div>
              <Label htmlFor="modal_name">Nombre del Proveedor</Label>
              <Input
                id="modal_name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="modal_contact_name">Nombre de Contacto</Label>
              <Input
                id="modal_contact_name"
                name="contact_name"
                value={form.contact_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="modal_contact_email">Email de Contacto</Label>
              <Input
                type="email"
                id="modal_contact_email"
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="modal_contact_phone">Teléfono de Contacto</Label>
              <Input
                id="modal_contact_phone"
                name="contact_phone"
                value={form.contact_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {form.id ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🗑️ Dialog de confirmación de borrado */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar proveedor</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar el proveedor{" "}
              <strong>{providerToDelete?.name}</strong>? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              type="button"
              onClick={confirmDeleteProvider}
            >
              Sí, eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default ProvidersPage;
