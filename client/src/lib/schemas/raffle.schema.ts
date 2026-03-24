import { z } from "zod";

import { Ticket } from "@/type/Ticket";
import { Prizes } from "@/type/Prizes";
import { priceSchema, futureDateSchema } from "./prize.schema.";

export const raffleSchema = z.object({
    title: z.string().min(3, "Mínimo 3 caracteres"),
    description: z.string().min(5, "Descripción muy corta"),
    price: priceSchema,
    end_date: futureDateSchema,
    digits: z.coerce.number().min(1).max(6),
    status: z.enum(["active", "inactive"]),
    tickets: z.array(z.custom<Ticket>()),
    prizes: z.array(z.custom<Prizes>()),
});
export type RaffleFormValues = z.infer<typeof raffleSchema>;