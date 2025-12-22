"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";

import { jwtDecode } from "jwt-decode";
import { AuthStore } from "@/store/authStore";
import { toast } from "sonner";

export function useAuth() {
  const getAuthService = () => new AuthService();
  const router = useRouter();

  const { user, setUser, logout: storeLogout } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);


  const [client, setClient] = useState<TokenClient | null>(null);

  const handleGoogleLogin = async (accessToken: string) => {
    try {
      setLoading(true);

      const userData = await getAuthService().getUserByGoogle({ token: accessToken });
      localStorage.setItem("token", userData.token);

      const persistRes = await getAuthService().getUserByToken(userData.token);

      setUser(persistRes.user, userData.token);

      startTokenWatcher(userData.token);
      setError(null);


      toast.success(`¡Bienvenido ${persistRes.user.name || ""}!`);

      if (persistRes.user.role === "admin") router.push("/dashboard");
      else router.push("/");

    } catch (err: any) {
      console.error("Error en login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const logout = useCallback(() => {
    storeLogout();
    router.push("/");
  }, [storeLogout, router]);

  const startTokenWatcher = useCallback(
    (token: string) => {
      try {
        const decoded: any = jwtDecode(token);
        const exp = decoded.exp * 1000;
        const timeLeft = exp - Date.now();

        if (timeLeft <= 0) {
          logout();
          return;
        }

        setTimeout(() => {
          logout();
        }, timeLeft);

      } catch (err) {
        console.error("Error decodificando token:", err);
        logout();
      }
    },
    [logout]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ NO hay token → auth ya fue evaluada
    if (!token) {
      setInitialized(true);
      return;
    }

    // ✅ ya hay usuario cargado
    if (user) {
      setInitialized(true);
      return;
    }

    const authService = new AuthService();
 

    (async () => {
      try {
        const res = await authService.getUserByToken(token);

        setUser(res.user, token);

        startTokenWatcher(token);
      } catch (err) {
        logout();
      } finally {
        // 🔥 CLAVE
        setInitialized(true);
      }
    })();
  }, []);


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
            await handleGoogleLogin(response.access_token);
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
    initialized,
  };
}
