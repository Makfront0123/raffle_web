import { z } from "zod";

export const priceSchema = z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Precio inválido")
    .refine((val) => parseFloat(val) > 0, "Debe ser mayor a 0");

export const futureDateSchema = z.string().refine((date) => {
    const end = new Date(date + "T23:59:59");
    const min = new Date();
    min.setDate(min.getDate() + 7);
    return end >= min;
}, "Debe ser mínimo 7 días después");


export const prizeSchema = z.object({
    name: z.string().min(3, "Nombre muy corto"),
    description: z.string().min(5, "Descripción muy corta"),
    value: z.number().min(1, "Debe ser mayor a 0"),
    raffle: z.string().min(1, "Selecciona una rifa"),
    provider: z.string().min(1, "Selecciona un proveedor"),
    type: z.enum(["product", "cash", "trip"]),
});

export type PrizeFormValues = z.infer<typeof prizeSchema>;