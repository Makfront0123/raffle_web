import { z } from "zod";

export const createPrizeSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(5),
    value: z.number().positive(),

    raffleId: z.coerce.number().int().positive(),
    providerId: z.coerce.number().int().positive(),

    type: z.enum(["product", "cash", "trip"]),
}).strict();

export const updatePrizeSchema = createPrizeSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debes enviar al menos un campo para actualizar",
    });