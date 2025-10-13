"use client";

import { useEffect, useState } from "react";
import { AuthService } from "@/services/authService";
import { useUserStore } from "@/stores/userStore";

const authService = new AuthService();

export function useAuth() {
    const { user, setUser, logout } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [client, setClient] = useState<any>(null);

    // Inicializa el cliente OAuth
    useEffect(() => {
        if (typeof window === "undefined") return;

        const interval = setInterval(() => {
            if (window.google && !client) {
                clearInterval(interval);

                const tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: import.meta.env.PUBLIC_GOOGLE_CLIENT_ID,
                    scope: "openid profile email",
                    ux_mode: "popup",
                    callback: async (response: any) => {
                        if (response && response.access_token) {
                            await handleCredentialResponse(response);
                        } else {
                            console.error("No se obtuvo access_token de Google", response);
                        }
                    },
                });


                setClient(tokenClient);

            }
        }, 300);

        return () => clearInterval(interval);
    }, []);
    const handleCredentialResponse = async (response: any) => {
  try {
    setLoading(true);
    const token = response.access_token; // ✅ solo este
    const userData = await authService.getUserByGoogle({ token });
    setUser(userData.user);
    localStorage.setItem("token", userData.token);
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
        client.requestAccessToken(); // ✅ método correcto para initTokenClient

    };

    return {
        user,
        loading,
        error,
        loginWithGoogle,
        logout,
    };
}


/*
"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ importar
import { AuthService } from "@/services/authService";
import { useUserStore } from "@/stores/userStore";

const authService = new AuthService();



export function useAuth() {
    const { user, setUser, logout } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || user) return;

        window.google.accounts.id.initialize({
            client_id: import.meta.env.PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            use_fedcm_for_prompt: false, // 👈 fuerza el modo anterior
        });


    }, []);

    const handleCredentialResponse = async (response: any) => {
        try {
            setLoading(true);
            setError(null);

            // token JWT devuelto por Google
            const token = response.credential;

            // ✅ decodificamos el JWT para obtener la info básica del usuario
            const decoded: any = jwtDecode(token);

            const googleUser: GoogleUserData = {
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
                token,
            };

            // enviamos los datos al backend para verificar
            const userData = await authService.getUserByGoogle(googleUser);
            setUser(userData);
        } catch (err: any) {
            console.error("Error en login:", err);
            setError("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = () => {
        if (!window.google) {
            console.error("Google Identity Services no está cargado");
            return;
        }
        window.google.accounts.id.prompt();
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