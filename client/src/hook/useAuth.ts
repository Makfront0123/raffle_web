"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";
import { AuthStore } from "@/store/authStore";

interface TokenClient {
  requestAccessToken: () => void;
}

const authService = new AuthService();

export function useAuth() {
  const router = useRouter();
  const { user, setUser, logout } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<TokenClient | null>(null);

  // 🔹 Restaurar sesión si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      setLoading(true);
      authService
        .getUserByToken(token)
        .then((res) => {
          setUser(res.user, token);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    }
  }, [user, setUser, logout]);

  // 🔹 Inicializar cliente OAuth (una sola vez)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initGoogleClient = () => {
      if (!(window as any).google) return;

      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: "openid profile email",
        ux_mode: "popup",
        callback: async (response: any) => {
          if (response?.access_token) {
            await handleCredentialResponse(response.access_token);
          } else {
            console.error("No se obtuvo access_token de Google", response);
          }
        },
      });

      setClient(tokenClient);
    };

    if ((window as any).google) {
      initGoogleClient();
    } else {
      const interval = setInterval(() => {
        if ((window as any).google) {
          clearInterval(interval);
          initGoogleClient();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  // 🔹 Redirigir después de iniciar sesión
  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") router.push("/admin/dashboard");
    else router.push("/");
  }, [user, router]);

  // 🔹 Manejar respuesta del login con Google
  const handleCredentialResponse = async (accessToken: string) => {
    try {
      setLoading(true);
      const userData = await authService.getUserByGoogle({ token: accessToken });
      setUser(userData.user, userData.token);
      localStorage.setItem("token", userData.token);
      setError(null);
    } catch (err: any) {
      console.error("Error en login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Acción para iniciar sesión con Google
  const loginWithGoogle = () => {
    if (!client) {
      console.error("Cliente OAuth de Google no inicializado aún");
      return;
    }
    client.requestAccessToken();
  };

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
  };
}
