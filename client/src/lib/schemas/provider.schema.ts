import { z } from "zod";

export const providerSchema = z.object({
    id: z.number().optional(), // 🔥 agrega esto
    name: z.string().min(3, "Nombre muy corto"),
    contact_name: z.string().min(3, "Nombre de contacto muy corto"),
    contact_email: z.string().email("Email inválido"),
    contact_phone: z
        .string()
        .min(7, "Teléfono muy corto"),
});
export type ProviderFormValues = z.infer<typeof providerSchema>;