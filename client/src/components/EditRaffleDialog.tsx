import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Raffle } from "@/type/Raffle";
import { toLocalDateInput } from "@/app/utils/toLocalDateInput";

interface EditRaffleDialogProps {
  raffle: Raffle;
  onSave: (updatedRaffle: Partial<Raffle>) => void;
}

export const EditRaffleDialog: React.FC<EditRaffleDialogProps> = ({ raffle, onSave }) => {

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: raffle.title ?? "",
    description: raffle.description ?? "",
    price: raffle.price != null ? raffle.price.toString() : "",
    end_date: raffle.end_date ? toLocalDateInput(raffle.end_date) : "",
  });


  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minEditableDate = today.toISOString().split("T")[0];





  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedFields: Partial<Raffle> = {};

    if (form.title.trim() && form.title !== raffle.title) updatedFields.title = form.title;
    if (form.description.trim() && form.description !== raffle.description) updatedFields.description = form.description;
    if (form.price.trim() && parseFloat(form.price) !== raffle.price) updatedFields.price = parseFloat(form.price);
    if (form.end_date.trim() && form.end_date !== raffle.end_date) updatedFields.end_date = form.end_date;


    onSave(updatedFields);
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
            <Label htmlFor="end_date">Fecha Fin</Label>
            <Input
              type="date"
              id="end_date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              min={minEditableDate}
            />

          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
