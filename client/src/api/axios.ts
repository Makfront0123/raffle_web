 import axios from "axios";
import { toast } from "sonner";
 

type ApiError = {
  error?: string;
  message?: string;
  code?: string;
};

let lastRateLimitToast = 0; // 👈 control global

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (err: unknown) => {
    if (axios.isAxiosError<ApiError>(err)) {
      const status = err.response?.status;
      const data = err.response?.data;

      // 🚫 evitar spam de 429
      if (status === 429) {
        const now = Date.now();

        if (now - lastRateLimitToast > 3000) { // 3 segundos
          toast.error(data?.error || "Demasiadas solicitudes ⏳");
          lastRateLimitToast = now;
        }

        return Promise.reject(err);
      }

      const message =
        data?.error ||
        data?.message ||
        "Ocurrió un error inesperado";

      toast.error(message);
    } else {
      toast.error("Error inesperado");
    }

    return Promise.reject(err);
  }
);