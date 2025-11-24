"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";

import { jwtDecode } from "jwt-decode";
import { AuthStore } from "@/store/authStore";
import { toast } from "sonner";
export function useAuth() {
  const authService = new AuthService();
  const router = useRouter();
  const { user, setUser, logout: storeLogout } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<TokenClient | null>(null);


  const logout = useCallback(() => {
    storeLogout();
    router.push("/");
  }, [storeLogout, router]);


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


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || user) return;

    try {
      const decoded: any = jwtDecode(token);
    
      const tempUser = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name, 
      };
      setUser(tempUser as any, token);
      startTokenWatcher(token);

 
      authService
        .getUserByToken(token)
        .then((res) => {
          setUser(res.user, token); 
        })
        .catch(() => logout());
    } catch {
      logout();
    }
  }, [user, setUser, startTokenWatcher, logout]);


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

  const handleCredentialResponse = async (accessToken: string) => {
    try {
      setLoading(true);
      const userData = await authService.getUserByGoogle({ token: accessToken });
      setUser(userData.user, userData.token);
      localStorage.setItem("token", userData.token);
      startTokenWatcher(userData.token);
      setError(null);

      toast.success(`¡Bienvenido ${userData.user.name || ""}! Has iniciado sesión correctamente.`);

      if (userData.user.role === "admin") router.push("/dashboard");
      else router.push("/");
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