import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Raffle } from "@/type/Raffle";

interface EditRaffleDialogProps {
  raffle: Raffle;
  onSave: (updatedRaffle: Partial<Raffle>) => void;
}

export const EditRaffleDialog: React.FC<EditRaffleDialogProps> = ({ raffle, onSave }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: raffle.title,
    description: raffle.description,
    price: raffle.price.toString(),
    digits: raffle.digits,
    end_date: raffle.end_date.split("T")[0], // mantener el nombre exacto
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      digits: Number(form.digits),
      end_date: form.end_date + "T23:59:59", // mantener end_date
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Rifa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" name="description" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="price">Precio</Label>
            <Input type="number" id="price" name="price" value={form.price} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="digits">Dígitos</Label>
            <Input type="number" id="digits" name="digits" value={form.digits} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="end_date">Fecha Fin</Label>
            <Input type="date" id="end_date" name="end_date" value={form.end_date} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
