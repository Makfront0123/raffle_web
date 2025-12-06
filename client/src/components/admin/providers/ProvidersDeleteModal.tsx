"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Providers } from "@/type/Providers";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Providers | null;
  onConfirm: () => void;
}

export function ProvidersDeleteModal({ open, onOpenChange, provider, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar proveedor</DialogTitle>
          <DialogDescription>
            ¿Seguro quieres eliminar <strong>{provider?.name}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button className="bg-red-500" onClick={onConfirm}>
            Sí, eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
