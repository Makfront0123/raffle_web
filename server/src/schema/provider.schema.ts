import { z } from "zod";

export const createProviderSchema = z.object({
    name: z.string().min(3),
    contact_name: z.string().min(3),
    contact_email: z.string().email(),
    contact_phone: z.string().min(10),
}).strict();

export const updateProviderSchema = createProviderSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debes enviar al menos un campo para actualizar",
    });
