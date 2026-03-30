import rateLimit from "express-rate-limit";


export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: "Demasiadas solicitudes. Intenta más tarde.",
        });
    },
});


export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    handler: (req, res) => {
        res.status(429).json({
            error: "Demasiados intentos de autenticación",
        });
    }
});

export const adminLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 500,
    handler: (req, res) => {
        res.status(429).json({
            error: "Demasiadas peticiones intenta más tarde",
        });
    }
});


export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
});


export const actionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
});


export const paymentActionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    //max: 20,
});


export const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50,
});


export const statusLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
});


export const cronLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
});


export const notificationLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
});



/*
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
});


export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        error: "Demasiados intentos de autenticación",
    },
});

export const adminLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 1000,
});


export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
});


export const actionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000,
});


export const paymentActionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 2000,
});


export const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 500,
});


export const statusLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1000,
});


export const cronLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
});


export const notificationLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5000,
});





/*
import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
});


export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {
        error: "Demasiados intentos de autenticación",
    },
});

export const adminLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 200,
});


export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
});


export const actionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
});


export const paymentActionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
});


export const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50,
});


export const statusLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
});


export const cronLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
});


export const notificationLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
});

*/