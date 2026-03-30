import { z } from "zod";

export const idSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const raffleIdSchema = z.object({
    raffleId: z.coerce.number().int().positive(),
});

export const regenerateTicketsSchema = z.object({
    raffleId: z.coerce.number().int().positive(),
    digits: z.coerce.number().int().min(1).max(10),
});

export const referenceSchema = z.object({
    reference: z.string().min(5),
});

export const whatsappSchema = z.object({
    payment_id: z.coerce.number().int().positive(),
    phone: z.string().min(10),
}).strict();