"use client";

import { useEffect, useState } from "react";
import { AuthService } from "@/services/authService";
import { AuthStore } from "@/store/authStore";

interface TokenClient {
    requestAccessToken: () => void;
}


const authService = new AuthService();

export function useAuth() {
    const { user, setUser, logout } = AuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [client, setClient] = useState<TokenClient | null>(null);

    // Inicializa el cliente OAuth
    useEffect(() => {
        if (typeof window === "undefined") return;

        const interval = setInterval(() => {
            if ((window as any).google && !client) {
                clearInterval(interval);

                const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
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
    }, [client]);

    const handleCredentialResponse = async (response: { access_token: string }) => {
        try {
            setLoading(true);
            const token = response.access_token;
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
