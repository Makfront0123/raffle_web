"use client";

import { useEffect, useState } from "react";

import { AuthService } from "@/services/authService";
import { useUserStore } from "@/stores/userStore";

const authService = new AuthService();

export function useAuth() {
    const { user, setUser, logout } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Inicializar Google Identity Services
    useEffect(() => {
        if (typeof window === "undefined" || user) return;

        window.google?.accounts.id.initialize({
            client_id: import.meta.env.PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            use_fedcm_for_prompt: false, // modo anterior temporal
        });
    }, []);

    const handleCredentialResponse = async (response: any) => {
        try {
            setLoading(true);
            setError(null);

            const googleToken = response.credential;

            const userData = await authService.getUserByGoogle({ token: googleToken });

            // Guardamos usuario
            setUser(userData.user);

            // Guardamos token del backend
            localStorage.setItem("token", userData.token);

            console.log("Usuario logueado:", userData.user);
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