"use client";

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


import { FormEvent } from "react";
import { useZodForm } from "@/hook/useZodForm";
import { PrizeFormValues, prizeSchema } from "@/lib/schemas/prize.schema.";
import { PrizeFormProps, PrizeType } from "@/type/Prizes";
import { motion } from "framer-motion";

export const initialPrizeForm: PrizeFormValues = {
    name: "",
    description: "",
    value: 0,
    raffle: "",
    provider: "",
    type: "product",
};
export function PrizeForm({
    raffles,
    providers,
    loadingRaffles,
    loadingProviders,
    onSubmit,
}: PrizeFormProps) {

    const {
        form,
        setForm,
        handleChange,
        validate,
        errors,
    } = useZodForm(initialPrizeForm, prizeSchema);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) return;

        await onSubmit(form);

        setForm(initialPrizeForm);
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
                        <Input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <div className="min-h-[20px] mt-1">
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: errors?.name ? 1 : 0, y: errors?.name ? 0 : -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-red-500 text-sm"
                                >
                                    {errors?.name?.[0] || ""}
                                </motion.p>
                            </div>
                        )}
                    </div>

                    <div>
                        <Label>Descripción</Label>
                        <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className={errors.description ? "border-red-500" : ""}
                        />

                        {errors.description && ( // 🔥 aquí entra Zod
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
                        )}
                    </div>

                    <div>
                        <Label>Valor del Premio</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-4 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                name="value"
                                value={form.value}
                                onChange={handleChange}
                                placeholder="Ej: 10.00"
                                className={`pl-7 ${errors.value ? "border-red-500" : ""}`}
                            />

                            {errors.value && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.value[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-10">
                        <div>
                            <Label>Rifa</Label>
                            <Select
                                value={form.raffle}
                                onValueChange={(v) =>
                                    setForm({ ...form, raffle: v })
                                }
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
                            onValueChange={(v) =>
                                setForm({ ...form, provider: v })
                            }
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