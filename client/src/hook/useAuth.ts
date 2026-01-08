"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { GoogleTokenClient, GoogleTokenResponse } from "@/type/GoogleUserData";

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
    await storeLogout();
    sessionStorage.removeItem("adminSplashShown");
    router.push("/");
  }, [storeLogout, router]);


  const loginAdmin = useCallback(
    async (email: string, password: string, onSplash?: () => void) => {
      try {
        await storeLoginAdmin(email, password);

        const currentUser = AuthStore.getState().user;
        if (currentUser?.role === "admin") {
          sessionStorage.setItem("justLoggedIn", "true");
          if (onSplash) onSplash();
        }

        toast.success(`¡Bienvenido ${currentUser?.name || "usuario"}!`);
      } catch (err: unknown) {
        throw err;
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
      } catch {
        toast.error("Error al iniciar sesión con Google");
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

  // ✅ FIX CRÍTICO AQUÍ
  useEffect(() => {
    if (skipPersist) {
      setInitialized(true);
      return;
    }

    (async () => {
      try {
        await storePersist();
      } catch (err) {
        await storeLogout();
      } finally {
        setInitialized(true);
      }
    })();
  }, [storePersist, skipPersist, storeLogout]);

  return {
    user,
    initialized,
    logout,
    loginWithGoogle,
    loginAdmin
  };
}
