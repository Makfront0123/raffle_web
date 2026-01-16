"use client";
import { ChangeEvent } from "react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Providers } from "@/type/Providers";
import { Raffle } from "@/type/Raffle";
import { PrizeFormProps, PrizeFormValues, PrizeType } from "@/type/Prizes";

export function PrizeForm({
    raffles,
    providers,
    loadingRaffles,
    loadingProviders,
    onSubmit,
}: PrizeFormProps) {
    const [form, setForm] = useState<PrizeFormValues>({
        name: "",
        description: "",
        value: 0,
        raffle: "",
        provider: "",
        type: "product",
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "value" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(form);
        setForm({
            name: "",
            description: "",
            value: 0,
            raffle: "",
            provider: "",
            type: "product",
        });
    };

    return (
        <Card className="mb-6 border-none shadow-lg">
            <CardHeader>
                <CardTitle>Crear Nuevo Premio</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div>
                        <Label>Nombre</Label>
                        <Input name="name" value={form.name} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Descripción</Label>
                        <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Valor del Premio</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                name="value"
                                value={form.value}
                                onChange={handleChange}
                                placeholder="Ej: 10.00"
                                className="pl-7"
                            />
                        </div>
                    </div>


                    <div className="flex gap-10">
                        <div>
                            <Label>Rifa</Label>
                            <Select
                                value={form.raffle}
                                onValueChange={(v) => setForm({ ...form, raffle: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>

                                <SelectContent>
                                    {raffles.length > 0 ? (
                                        raffles.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>
                                                {r.title}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem disabled value="none">
                                            {loadingRaffles ? "Cargando..." : "No hay rifas"}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Tipo</Label>
                            <Select
                                value={form.type}
                                onValueChange={(v: PrizeType) =>
                                    setForm((prev) => ({ ...prev, type: v }))
                                }
                            >

                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
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
                        <Select
                            value={form.provider}
                            onValueChange={(v) => setForm({ ...form, provider: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                                {providers.length > 0 ? (
                                    providers.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem disabled value="none">
                                        {loadingProviders ? "Cargando..." : "No hay proveedores"}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit">Crear Premio</Button>
                </form>
            </CardContent>
        </Card>
    );
}
