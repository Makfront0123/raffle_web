"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RaffleFormLocal } from "@/hook/useRaffleForm";
import { ChangeEvent, FormEvent } from "react";

interface Props {
  form: RaffleFormLocal;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  minDate: string;
}


export const RaffleForm = ({
  form,
  handleChange,
  handleSubmit,
  minDate,
}: Props) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Crear Nueva Rifa</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <Label>Título</Label>
            <Input name="title" value={form.title} onChange={handleChange} />
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <Label>Descripción</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Precio</Label>
            <Input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Dígitos</Label>
            <Input
              type="number"
              name="digits"
              value={form.digits}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Fecha de Finalización</Label>
            <Input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              min={minDate}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" className="w-full sm:w-auto">
              Crear Rifa
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
