import { z } from "zod";

export const createReservationSchema = z.object({
    raffle_id: z.coerce.number().int().positive(),

    ticket_ids: z.array(
        z.coerce.number().int().positive()
    ).min(1).max(10),
}).strict();