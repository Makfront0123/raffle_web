import { z } from "zod";

export const createReservationSchema = z.object({
    raffleId: z.coerce.number().int().positive(),

    ticketIds: z.array(
        z.coerce.number().int().positive()
    ).min(1).max(10),
}).strict();