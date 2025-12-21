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

  const { user, setUser, logout: storeLogout, phoneModalOpen, setPhoneModalOpen } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [client, setClient] = useState<TokenClient | null>(null);


  // =======================================
  // 🔥 1. Función ÚNICA para manejar Google
  // =======================================
  const handleGoogleLogin = async (accessToken: string) => {
    try {
      setLoading(true);

      const userData = await getAuthService().getUserByGoogle({ token: accessToken });

      // Guardar token temporalmente
      localStorage.setItem("token", userData.token);

      // 🔥 AHORA SÍ persistimos (obtiene phone actualizado desde DB)
      const persistRes = await getAuthService().getUserByToken(userData.token);

      // Guardamos el usuario REAL (ya con phone)
      setUser(persistRes.user, userData.token);

      startTokenWatcher(userData.token);
      setError(null);

      // Mostrar modal si NO hay teléfono
      // No mostrar modal al admin
      if (persistRes.user.role !== "admin" && !persistRes.user.phone) {
        setPhoneModalOpen(true);
      } else {
        setPhoneModalOpen(false);
      }



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

  // =======================================
  // 2. Actualizar teléfono
  // =======================================
  const updatePhone = async (phone: string) => {
    try {
      const res = await getAuthService().updatePhone({ phone, token: localStorage.getItem("token")! });

      setUser(res.user, localStorage.getItem("token")!);
      setPhoneModalOpen(false);

      toast.success("Teléfono actualizado correctamente.");
    } catch (err: any) {
      toast.error("Error al actualizar teléfono");
    }
  };

  // =======================================
  // 3. Logout
  // =======================================
  const logout = useCallback(() => {
    storeLogout();
    router.push("/");
  }, [storeLogout, router]);

  // =======================================
  // 4. Watcher para expiración de token
  // =======================================
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

  // =======================================
  // 5. Mantener sesión en recarga
  // =======================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || user) return;

    const authService = new AuthService();
    const { setUser, setPhoneModalOpen } = AuthStore.getState();

    (async () => {
      try {
        const res = await authService.getUserByToken(token);

        // Guardamos usuario
        setUser(res.user, token);

        // Reglas para mostrar el modal
        if (res.user.role !== "admin" && !res.user.phone) {
          setPhoneModalOpen(true);
        } else {
          setPhoneModalOpen(false);
        }

      } catch (err) {
        logout();
      }
    })();
  }, []);


  // =======================================
  // 6. Inicializar Google OAuth → TokenClient
  // =======================================
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

  // =======================================
  // 7. Función para botón "Continuar con Google"
  // =======================================
  const loginWithGoogle = () => {
    if (!client) {
      console.error("Cliente OAuth de Google no inicializado aún");
      return;
    }
    client.requestAccessToken();
  };

  // =======================================
  // RETURN DEL HOOK
  // =======================================
  return {
    user,
    loading,
    error,

    loginWithGoogle,
    logout,

    phoneModalOpen,
    setPhoneModalOpen,
    updatePhone,
  };
}
