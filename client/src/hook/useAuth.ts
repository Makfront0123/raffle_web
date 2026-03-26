"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { GoogleTokenClient, GoogleTokenResponse } from "@/type/GoogleUserData";
import { AxiosError } from "axios";
import { handleApiError } from "@/helper/handleApiError";

interface UseAuthOptions {
  skipPersist?: boolean;
}

export function useAuth({ skipPersist = false }: UseAuthOptions = {}) {
  const router = useRouter();
  const {
    user,
    logout: storeLogout,
    loginAdmin: storeLoginAdmin,
    loginWithGoogle: storeLoginWithGoogle,
    persist: storePersist,
  } = AuthStore();

  const [initialized, setInitialized] = useState(false);
  const [googleClient, setGoogleClient] = useState<GoogleTokenClient | null>(null);

  const logout = useCallback(async () => {
    try {
      await storeLogout();

      toast.success("Sesión cerrada correctamente");

      sessionStorage.removeItem("adminSplashShown");
      sessionStorage.removeItem("admin_onboarding_seen");
      router.push("/");
    } catch (err) {
      handleApiError(err, "Error al cerrar sesión");
    }
  }, [storeLogout, router]);


  const loginAdmin = useCallback(
    async (email: string, password: string, onSplash?: () => void) => {
      try {
        await storeLoginAdmin(email, password);
        const currentUser = AuthStore.getState().user;

        if (currentUser?.role === "admin") {
          if (onSplash) onSplash();
        }

        toast.success(`¡Bienvenido ${currentUser?.name || "usuario"}!`);
      } catch (err) {
        const error = err as AxiosError<ApiError>;

        if (error.response?.status === 429) {
          toast.error("Demasiados intentos. Intenta más tarde ⏳");
          return;
        }

        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Error al iniciar sesión con Google";

        toast.error(message);
      }
    },
    [storeLoginAdmin]
  );

  const handleGoogleLogin = useCallback(
    async (googleToken: string) => {
      try {
        await storeLoginWithGoogle(googleToken);
        const currentUser = AuthStore.getState().user;

        toast.success(`¡Bienvenido ${currentUser?.name || "usuario"}!`);
      } catch (err) {
        const error = err as AxiosError<ApiError>;

        if (error.response?.status === 429) {
          toast.error("Demasiados intentos. Intenta más tarde ⏳");
          return;
        }

        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Error al iniciar sesión con Google";

        toast.error(message);
      }
    },
    [storeLoginWithGoogle]
  );


  const loginWithGoogle = useCallback(() => {
    if (!googleClient) {
      toast.error("Google no está listo todavía");
      return;
    }
    googleClient.requestAccessToken();
  }, [googleClient]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initGoogleClient = () => {
      if (!window.google) return;

      const client: GoogleTokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: "openid profile email",
        ux_mode: "popup",
        callback: (response: GoogleTokenResponse) => {
          if (response.access_token) handleGoogleLogin(response.access_token);
        },
      });

      setGoogleClient(client);
    };

    if (window.google) {
      initGoogleClient();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogleClient();
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [handleGoogleLogin]);

  useEffect(() => {
    if (skipPersist) {
      setInitialized(true);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        await storePersist();
      } catch {
        await storeLogout();
      } finally {
        if (mounted) setInitialized(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    initialized,
    logout,
    loginWithGoogle,
    loginAdmin
  };
}


type ApiError = {
  error?: string;
  message?: string;
};