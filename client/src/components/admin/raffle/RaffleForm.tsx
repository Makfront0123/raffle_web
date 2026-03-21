"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RaffleFormLocal } from "@/hook/useRaffleForm";
import { ChangeEvent, FormEvent } from "react";

import { motion } from "framer-motion";

interface Props {
  form: RaffleFormLocal;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  minDate: string;
  errors: Record<string, string[] | undefined>;
}

export const RaffleForm = ({
  form,
  handleChange,
  handleSubmit,
  minDate,
  errors,
}: Props) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Crear nueva rifa
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <Label>Título</Label>
            <Input name="title" value={form.title} onChange={handleChange} />
            <div className="min-h-[20px] mt-1">
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: errors?.title ? 1 : 0, y: errors?.title ? 0 : -4 }}
                transition={{ duration: 0.2 }}
                className="text-red-500 text-sm"
              >
                {errors?.title?.[0] || ""}
              </motion.p>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <Label>Descripción</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            <div className="min-h-[20px] mt-1">
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: errors?.description ? 1 : 0, y: errors?.description ? 0 : -4 }}
                transition={{ duration: 0.2 }}
                className="text-red-500 text-sm"
              >
                {errors?.description?.[0] || ""}
              </motion.p>
            </div>
          </div>
          <div>
            <Label>Precio</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Ej: 10.00"
                className="pl-7"
              />
            </div>
            <div className="min-h-[20px] mt-1">
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: errors?.price ? 1 : 0, y: errors?.price ? 0 : -4 }}
                transition={{ duration: 0.2 }}
                className="text-red-500 text-sm"
              >
                {errors?.price?.[0] || ""}
              </motion.p>
            </div>
          </div>
          <div>
            <Label>Dígitos</Label>
            <Input
              type="number"
              name="digits"
              value={form.digits}
              onChange={handleChange}
              placeholder="Ej: 4"
              min={1}
              max={10}
            />
            <p className="text-xs text-gray-400 mt-1">
              Número de dígitos para generar los tickets aleatorios
            </p>
            <div className="min-h-[20px] mt-1">
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: errors?.digits ? 1 : 0, y: errors?.digits ? 0 : -4 }}
                transition={{ duration: 0.2 }}
                className="text-red-500 text-sm"
              >
                {errors?.digits?.[0] || ""}
              </motion.p>
            </div>
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
            <div className="min-h-[20px] mt-1">
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: errors?.end_date ? 1 : 0, y: errors?.end_date ? 0 : -4 }}
                transition={{ duration: 0.2 }}
                className="text-red-500 text-sm"
              >
                {errors?.end_date?.[0] || ""}
              </motion.p>
            </div>
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