import { z } from "zod";

export const createPaymentSchema = z.object({
    raffle_id: z.coerce.number().int().positive(),
    ticket_ids: z.array(z.coerce.number().int().positive()).min(1),
    reference: z.string().min(5),
    reservation_id: z.coerce.number().int().optional(),
}).strict();