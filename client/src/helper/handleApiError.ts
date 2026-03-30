import { toast } from "sonner";
import axios, { AxiosError } from "axios";

type ApiError = {
    error?: string;
    message?: string;
};
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
        const status = err.response?.status;
        if (status === 429) {
            toast.error(
                err.response?.data?.error ||
                "Demasiadas solicitudes. Intenta más tarde ⏳",
                { id: "rate-limit" }
            );
            return;
        }

        toast.error(
            err.response?.data?.error ||
            err.response?.data?.message ||
            defaultMessage,
            { id: "api-error" }
        );
        return;
    }

    toast.error(defaultMessage, { id: "api-error" });
};