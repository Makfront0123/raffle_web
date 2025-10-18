"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
 
interface RaffleForm {
  title: string;
  description: string;
  total_numbers: number;
  price: number;
  end_date: string;
  digits: number;
}

const RafflesAdmin = () => {
  const [form, setForm] = useState<RaffleForm>({
    title: "",
    description: "",
    total_numbers: 100,
    price: 10,
    end_date: "",
    digits: 3,
  });

  const [raffles, setRaffles] = useState<RaffleForm[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la llamada a tu API para guardar en la base de datos
    setRaffles([...raffles, form]);
    setForm({
      title: "",
      description: "",
      total_numbers: 100,
      price: 10,
      end_date: "",
      digits: 3,
    });
  };

  return (
    
 
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Administrar Rifas</h1>

        {/* Formulario para crear rifa */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Crear Nueva Rifa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" value={form.description} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="total_numbers">Total de Números</Label>
                <Input type="number" id="total_numbers" name="total_numbers" value={form.total_numbers} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input type="number" step="0.01" id="price" name="price" value={form.price} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="digits">Cantidad de Dígitos</Label>
                <Input type="number" id="digits" name="digits" value={form.digits} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="end_date">Fecha de Finalización</Label>
                <Input type="date" id="end_date" name="end_date" value={form.end_date} onChange={handleChange} required />
              </div>
              <Button type="submit">Crear Rifa</Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de rifas */}
        <Card>
          <CardHeader>
            <CardTitle>Rifas Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            {raffles.length === 0 ? (
              <p>No hay rifas creadas.</p>
            ) : (
              <table className="w-full table-auto border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Título</th>
                    <th className="px-4 py-2 text-left">Total Números</th>
                    <th className="px-4 py-2 text-left">Precio</th>
                    <th className="px-4 py-2 text-left">Dígitos</th>
                    <th className="px-4 py-2 text-left">Fecha Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {raffles.map((r, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{r.title}</td>
                      <td className="px-4 py-2">{r.total_numbers}</td>
                      <td className="px-4 py-2">{r.price}</td>
                      <td className="px-4 py-2">{r.digits}</td>
                      <td className="px-4 py-2">{r.end_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>
   
  );
};

export default RafflesAdmin;
