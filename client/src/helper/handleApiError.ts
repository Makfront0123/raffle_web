import { toast } from "sonner";
import axios, { AxiosError } from "axios";

type ApiError = {
    error?: string;
    message?: string;
};

interface RateLimitAxiosError<T = unknown> extends AxiosError<T> {
    isRateLimit?: boolean;
}
let lastToastTime = 0;

export const handleApiError = (
    err: unknown,
    defaultMessage: string
) => {
    const now = Date.now();
    if (now - lastToastTime < 2000) return;

    lastToastTime = now;

    if (err instanceof Error && !axios.isAxiosError(err)) {
        toast.error(err.message, { id: "api-error" });
        return;
    }

    if (axios.isAxiosError<ApiError>(err)) {
        const error = err as RateLimitAxiosError<ApiError>;

        if (error.isRateLimit) {
            toast.error(
                error.response?.data?.error ||
                "Demasiadas solicitudes",
                { id: "rate-limit" }
            );
            return;
        }

        toast.error(
            error.response?.data?.error ||
            error.response?.data?.message ||
            defaultMessage,
            { id: "api-error" }
        );
        return;
    }

    toast.error(defaultMessage, { id: "api-error" });
};