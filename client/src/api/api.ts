import axios, { AxiosError } from "axios";

type ApiError = {
  error?: string;
  message?: string;
  code?: string;
};

interface RateLimitAxiosError<T = unknown> extends AxiosError<T> {
  isRateLimit?: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (err: unknown) => {
    if (axios.isAxiosError<ApiError>(err)) {
      const error = err as RateLimitAxiosError;
      if (error.response?.status === 429) {
        error.isRateLimit = true;
      }
      return Promise.reject(error);
    }

    return Promise.reject(err);
  }
);