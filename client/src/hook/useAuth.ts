"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";
import { AuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";

interface DecodedJWT {
  exp: number;
}

const authService = new AuthService();

export function useAuth() {
  const router = useRouter();
  const { user, token, refreshToken, setUser, logout: storeLogout, updateToken } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    storeLogout();
    router.push("/");
  }, [storeLogout, router]);
 
  const tryRefreshToken = useCallback(async () => {
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const { token: newToken } = await authService.refreshToken(refreshToken);
      updateToken(newToken);
      localStorage.setItem("token", newToken);
      startTokenWatcher(newToken);  
      console.log("🔄 Token actualizado automáticamente");
    } catch (err) {
      console.error("Error al refrescar token:", err);
      logout();
    }
  }, [refreshToken, logout, updateToken]);

 
  const startTokenWatcher = useCallback(
    (token: string) => {
      try {
        const decoded = jwtDecode<DecodedJWT>(token);
        const exp = decoded.exp * 1000;
        const timeLeft = exp - Date.now();
 
        const refreshBefore = timeLeft - 60_000;

        if (refreshBefore <= 0) {
          tryRefreshToken();
          return;
        }

        setTimeout(() => {
          tryRefreshToken();
        }, refreshBefore);
      } catch (err) {
        console.error("Error decodificando token:", err);
        logout();
      }
    },
    [logout, tryRefreshToken]
  );
 
  useEffect(() => {
    if (!token || user) return;
    setLoading(true);
    authService
      .getUserByToken(token)
      .then((res) => {
        setUser(res.user, token, refreshToken);
        startTokenWatcher(token);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token, user, setUser, startTokenWatcher, logout, refreshToken]);

  return {
    user,
    token,
    loading,
    error,
    logout,
  };
}






/*
interface TokenClient {
  requestAccessToken: () => void;
}

const authService = new AuthService();

export function useAuth() {
  const router = useRouter();
  const { user, setUser, logout: storeLogout } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<TokenClient | null>(null);

  // ✅ Logout que limpia store y hace SPA redirect
  const logout = useCallback(() => {
    storeLogout();
    router.push("/");
  }, [storeLogout, router]);

  // Manejo de expiración de token
  const startTokenWatcher = useCallback((token: string) => {
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
  }, [logout]);

  // Inicialización con token en localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      setLoading(true);
      authService
        .getUserByToken(token)
        .then((res) => {
          setUser(res.user, token);
          startTokenWatcher(token);
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    }
  }, [user, setUser, startTokenWatcher, logout]);

  // Inicialización Google OAuth
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

  // Redirección según rol
  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") router.push("/dashboard");
    else router.push("/");
  }, [user, router]);

  // Manejo del login con Google
  const handleCredentialResponse = async (accessToken: string) => {
    try {
      setLoading(true);
      const userData = await authService.getUserByGoogle({ token: accessToken });
      setUser(userData.user, userData.token);
      localStorage.setItem("token", userData.token);
      startTokenWatcher(userData.token);
      setError(null);
    } catch (err: any) {
      console.error("Error en login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

*/