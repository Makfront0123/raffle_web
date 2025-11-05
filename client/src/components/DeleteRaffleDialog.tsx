import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Raffle } from "@/type/Raffle";

interface DeleteRaffleDialogProps {
  raffle: Raffle;
  onConfirm: (raffleId: number) => void;
}

export const DeleteRaffleDialog: React.FC<DeleteRaffleDialogProps> = ({ raffle, onConfirm }) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(raffle.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar esta rifa?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará la rifa{" "}
            <strong>{raffle.title}</strong> y todos sus boletos asociados.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirmar eliminación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
