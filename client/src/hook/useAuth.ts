"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";

import { AuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { GoogleTokenClient, GoogleTokenResponse } from "@/type/GoogleUserData";
import { jwtDecode, JwtPayload } from "jwt-decode";

export function useAuth() {
  const router = useRouter();
  const { user, setUser, logout: storeLogout } = AuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [showAdminSplash, setShowAdminSplash] = useState(false);
  const [client, setClient] = useState<GoogleTokenClient | null>(null);

  // Logout
  const logout = useCallback(() => {
    storeLogout();
    router.push("/");
  }, [storeLogout, router]);

  const startTokenWatcher = useCallback((token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const timeLeft = decoded.exp! * 1000 - Date.now();

      if (timeLeft <= 0) {
        logout();
        return;
      }

      const timer = setTimeout(logout, timeLeft);
      return () => clearTimeout(timer);
    } catch {
      logout();
    }
  }, [logout]);
  // Login con Google
  const handleGoogleLogin = useCallback(async (accessToken: string) => {
    try {
      setLoading(true);

      const userData = await new AuthService().getUserByGoogle({ token: accessToken });
      localStorage.setItem("token", userData.token);

      const persistRes = await new AuthService().getUserByToken(userData.token);
      setUser(persistRes.user, userData.token);

      startTokenWatcher(userData.token);
      setError(null);

      toast.success(`¡Bienvenido ${persistRes.user.name || ""}!`);

      if (persistRes.user.role === "admin") {
        sessionStorage.setItem("adminSplash", "true");
        setShowAdminSplash(true);

        setTimeout(() => router.push("/dashboard"), 50);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router, setUser, startTokenWatcher]);


  // Observador de expiración del token


  // Inicialización del usuario desde token en localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || user) {
      setInitialized(true);
      return;
    }

    (async () => {
      try {
        const res = await new AuthService().getUserByToken(token);
        setUser(res.user, token);
        startTokenWatcher(token);
      } catch {
        logout();
      } finally {
        setInitialized(true);
      }
    })();
  }, [logout, setUser, startTokenWatcher, user]);

  // Inicialización del cliente OAuth de Google
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initGoogleClient = () => {
      if (!window.google) return;

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: "openid profile email",
        ux_mode: "popup",
        callback: async (response: GoogleTokenResponse) => {
          if (response.access_token) await handleGoogleLogin(response.access_token);
        },
      });

      setClient(tokenClient);
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

  const loginWithGoogle = useCallback(() => {
    if (!client) {
      console.error("Cliente OAuth de Google no inicializado aún");
      return;
    }
    client.requestAccessToken();
  }, [client]);

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    initialized,
    showAdminSplash,
  };
}
