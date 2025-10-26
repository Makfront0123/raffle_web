"use client";

import React, { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRaffles } from "@/hook/useRaffles";
import { useProviders } from "@/hook/useProviders";
import { AuthStore } from "@/store/authStore";
import { Providers } from "@/type/Providers";
import { usePrizes } from "@/hook/usePrizes";

export interface PrizeForm {
  name: string;
  description: string;
  value: number;
  raffle: string;
  provider: string;
  type: string; // 👈 nuevo campo
}


const PrizesPage = () => {
  const [form, setForm] = useState<PrizeForm>({
    name: "",
    description: "",
    value: 0,
    raffle: "",
    provider: "",
    type: "product", // 👈 valor por defecto
  });



  const { token } = AuthStore();
  const { raffles, loading: loadingRaffles } = useRaffles();
  const { providers, loading: loadingProviders } = useProviders(token || "");

  const { prizes, loading, createPrize } = usePrizes();




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPrize(form);
    setForm({ name: "", description: "", value: 0, raffle: "", provider: "", type: "product" });
  };


  return (

    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Premios</h1>

      {/* Formulario para crear premio */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Crear Nuevo Premio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="name">Nombre del Premio</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="value">Valor</Label>
              <Input type="number" step="0.01" id="value" name="value" value={form.value} onChange={handleChange} required />
            </div>
            <div className="flex items-center gap-x-10">
              <div>
                <Label>Rifa</Label>
                <Select value={form.raffle} onValueChange={(value) => setForm({ ...form, raffle: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una rifa" />
                  </SelectTrigger>
                  <SelectContent>
                    {raffles.length > 0 ? (
                      raffles.map((r) => (
                        <SelectItem key={r.id ?? r.title} value={r.id?.toString() ?? r.title}>
                          {r.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-raffles" disabled>
                        No hay rifas disponibles
                      </SelectItem>
                    )}
                  </SelectContent>


                </Select>
              </div>
              <div>
                <Label>Tipo de Premio</Label>
                <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de premio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Producto</SelectItem>
                    <SelectItem value="cash">Dinero</SelectItem>
                    <SelectItem value="trip">Viaje</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
            <div>
              <Label>Proveedor</Label>
              <Select value={form.provider} onValueChange={(value) => setForm({ ...form, provider: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {providers.length > 0 ? (
                    providers.map((p) => (
                      <SelectItem key={p.id ?? p.name} value={p.id?.toString() ?? p.name}>
                        {p.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-providers" disabled>
                      No hay proveedores disponibles
                    </SelectItem>
                  )}
                </SelectContent>

              </Select>
            </div>
            <Button type="submit">Crear Premio</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de premios */}
      <Card>
        <CardHeader>
          <CardTitle>Premios Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {prizes.length === 0 ? (
            <p>No hay premios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Descripción</th>
                    <th className="px-4 py-2 text-left">Valor</th>
                    <th className="px-4 py-2 text-left">Rifa</th>
                    <th className="px-4 py-2 text-left">Proveedor</th>
                  </tr>
                </thead>
                <tbody>
                  {prizes.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.description}</td>
                      <td className="px-4 py-2">${p.value}</td>
                      <td className="px-4 py-2">{p.raffle?.title ?? "Sin rifa"}</td>
                      <td>{p.provider?.name ?? "Sin proveedor"}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>

  );
};

export default PrizesPage;
