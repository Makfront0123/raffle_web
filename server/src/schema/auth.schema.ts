import { z } from "zod";

export const googleSchema = z.object({
    token: z.string().min(10),
});

export const loginAdminSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const adminSetupSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    setupKey: z.string().min(1),
});