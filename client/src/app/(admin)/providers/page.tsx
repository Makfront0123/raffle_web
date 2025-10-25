"use client";

import React, { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProviders } from "@/hook/useProviders";
import { useAuth } from "@/hook/useAuth";
import { AuthStore } from "@/store/authStore";
import { Providers } from "@/type/Providers";
import { AuthDialog } from "@/components/AuthDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";




const ProvidersPage = () => {
    const { token } = AuthStore();
    const { providers, addProvider, loading, error, updateProvider, deleteProvider, getProviderById } = useProviders(token ?? "");
    const [open, setOpen] = useState(false); // controla el modal

    const [form, setForm] = useState<Providers>({
        name: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.id) {
            const { id, name, contact_name, contact_email, contact_phone } = form;
            const data = { name, contact_name, contact_email, contact_phone };
            await updateProvider(id, data, token ?? "");
        }else {
            await addProvider(form, token ?? "");
        }


        setForm({ name: "", contact_name: "", contact_email: "", contact_phone: "" });
        setOpen(false);
    };



    const handleEdit = (id: number) => {
        const provider = providers.find(p => p.id === id);
        if (provider) {
            setForm(provider);
            setOpen(true);
        }
    };



    const handleDelete = async (id: number) => {
        await deleteProvider(id, token ?? "");
    };

    return (
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Proveedores</h1>

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

            
            <Card>
                <CardHeader>
                    <CardTitle>Proveedores Existentes</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading && <p>Cargando proveedores...</p>}
                    {error && <p className="text-red-500">{error}</p>}
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
                                        <th className="px-4 py-2 text-left">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {providers.map((p, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="px-4 py-2">{p.name}</td>
                                            <td className="px-4 py-2">{p.contact_name}</td>
                                            <td className="px-4 py-2">{p.contact_email}</td>
                                            <td className="px-4 py-2">{p.contact_phone}</td>
                                            <div className="flex items-center gap-3 p-3">
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-3">
                                                        <Button className="p-3 bg-red-500" onClick={() => handleDelete(p.id!)}>Eliminar</Button>
                                                        <Button className="p-3 bg-green-500" onClick={() => handleEdit(p.id!)}>Editar</Button>
                                                    </div>
                                                </td>

                                            </div>
                                        </tr>
                                    ))}

                                </tbody>

                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{form.id ? "Editar Proveedor" : "Agregar Proveedor"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
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
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit">{form.id ? "Actualizar" : "Agregar"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>


        </main>
    );
};

export default ProvidersPage;
