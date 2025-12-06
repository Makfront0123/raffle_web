"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProvidersForm } from "./ProvidersForm";
import { ProviderFormState } from "@/hook/useProviderLogic";

interface ProvidersEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ProviderFormState;
  onChange: (e: any) => void;
  onSubmit: (e: any) => void;
}

export function ProvidersEditModal({
  open,
  onOpenChange,
  form,
  onChange,
  onSubmit
}: ProvidersEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {form.id ? "Editar Proveedor" : "Agregar Proveedor"}
          </DialogTitle>

          <DialogDescription>
            {form.id ? "Modifica los datos del proveedor" : "Agregar nuevo proveedor"}
          </DialogDescription>
        </DialogHeader>

        <ProvidersForm
          form={form}
          onChange={onChange}
          onSubmit={onSubmit}
          submitLabel={form.id ? "Actualizar" : "Guardar"}
        />
      </DialogContent>
    </Dialog>
  );
}
