import { z } from "zod";

export const createRaffleSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(5),

    price: z.number().positive(),

    endDate: z.string().datetime(),

    digits: z.number().int().min(1).max(6),
}).strict();

export const updateRaffleSchema = createRaffleSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debes enviar al menos un campo para actualizar",
    });
