import { toast } from "sonner";
import axios, { AxiosError } from "axios";

type ApiError = {
    error?: string;
    message?: string;
};

interface RateLimitAxiosError<T = unknown> extends AxiosError<T> {
    isRateLimit?: boolean;
}
export const handleApiError = (
    err: unknown,
    defaultMessage: string
) => {
    if (err instanceof Error && !axios.isAxiosError(err)) {
        toast.error(err.message);
        return;
    }

    if (axios.isAxiosError<ApiError>(err)) {
        const error = err as RateLimitAxiosError<ApiError>;

        if (error.isRateLimit) {
            toast.error(
                error.response?.data?.error ||
                "Demasiadas solicitudes"
            );
            return;
        }

        toast.error(
            error.response?.data?.error ||
            error.response?.data?.message ||
            defaultMessage
        );
        return;
    }

    toast.error(defaultMessage);
};