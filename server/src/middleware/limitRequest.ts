import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3000,
    standardHeaders: true,
    legacyHeaders: false,
});


export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    message: {
        error: "Demasiados intentos de autenticación",
    },
});

export const adminLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 100000,
});


export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
});


export const actionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50000,
});


export const paymentActionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20000,
});


export const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200,
});


export const statusLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 60000,
});


export const cronLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50000,
});


export const notificationLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10000,
});
