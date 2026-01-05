"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";
import { AuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { GoogleTokenClient, GoogleTokenResponse } from "@/type/GoogleUserData";

interface UseAuthOptions {
  skipPersist?: boolean;
}

function isAxiosError(err: unknown): err is { response?: { status?: number } } {
  return typeof err === "object" && err !== null && "response" in err;
}

export function useAuth({ skipPersist = false }: UseAuthOptions = {}) {
  const router = useRouter();
  const { user, setUser, logout: storeLogout } = AuthStore();
  const [initialized, setInitialized] = useState(false);
  const [googleClient, setGoogleClient] = useState<GoogleTokenClient | null>(null);

  const logout = useCallback(async () => {
    await new AuthService().logout();
    sessionStorage.removeItem("adminSplashShown");
    storeLogout();
    router.push("/");
  }, [storeLogout, router]);

  const handleGoogleLogin = useCallback(
    async (googleToken: string) => {
      try {
        const res = await new AuthService().getUserByGoogle({ token: googleToken });
        setUser(res.user);
        toast.success(`¡Bienvenido ${res.user.name}!`);
      } catch {
        toast.error("Error al iniciar sesión");
      }
    },
    [setUser]
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

    (async () => {
      try {
        const res = await new AuthService().persist();
        setUser(res.user);
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 401) {
          storeLogout();
        } else {
          console.error("Error verificando sesión:", err);
        }
      } finally {
        setInitialized(true);
      }
    })();
  }, [setUser, storeLogout, skipPersist]);

  return {
    user,
    initialized,
    logout,
    loginWithGoogle,
  };
}
