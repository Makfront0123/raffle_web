"use client";

import { Provider, useState } from "react";
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

export interface PrizeFormValues {
    name: string;
    description: string;
    value: number;
    raffle: string;
    provider: string;
    type: string;
}

interface PrizeFormProps {
    raffles: Raffle[];
    providers: Providers[];
    loadingRaffles: boolean;
    loadingProviders: boolean;
    onSubmit: (values: PrizeFormValues) => Promise<void>;
}

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

    const handleChange = (e: any) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: any) => {
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
        <Card className="mb-6">
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
                        <Label>Valor</Label>
                        <Input
                            type="number"
                            name="value"
                            value={form.value}
                            onChange={handleChange}
                        />
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
                                onValueChange={(v) => setForm({ ...form, type: v })}
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
