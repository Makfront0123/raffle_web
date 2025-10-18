"use client";

import React, { useState } from "react";
 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Provider {
    name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
}

const ProvidersPage = () => {
    const [form, setForm] = useState<Provider>({
        name: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
    });

    const [providers, setProviders] = useState<Provider[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la llamada a tu API para guardar en la base de datos
        setProviders([...providers, form]);
        setForm({ name: "", contact_name: "", contact_email: "", contact_phone: "" });
    };

    return (

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Proveedores</h1>

            {/* Formulario para crear proveedor */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Agregar Nuevo Proveedor</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div>
                            <Label htmlFor="name">Nombre del Proveedor</Label>
                            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="contact_name">Nombre de Contacto</Label>
                            <Input id="contact_name" name="contact_name" value={form.contact_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="contact_email">Email de Contacto</Label>
                            <Input type="email" id="contact_email" name="contact_email" value={form.contact_email} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
                            <Input id="contact_phone" name="contact_phone" value={form.contact_phone} onChange={handleChange} required />
                        </div>
                        <Button type="submit">Agregar Proveedor</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Lista de proveedores */}
            <Card>
                <CardHeader>
                    <CardTitle>Proveedores Existentes</CardTitle>
                </CardHeader>
                <CardContent>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {providers.map((p, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="px-4 py-2">{p.name}</td>
                                            <td className="px-4 py-2">{p.contact_name}</td>
                                            <td className="px-4 py-2">{p.contact_email}</td>
                                            <td className="px-4 py-2">{p.contact_phone}</td>
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

export default ProvidersPage;
