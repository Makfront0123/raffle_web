 
import { jwtDecode } from "jwt-decode";
import { AuthStore } from "@/store/authStore";

export function startTokenWatcher() {
    const token = AuthStore.getState().token || localStorage.getItem("token");
    if (!token) return;

    try {
        const decoded: any = jwtDecode(token);
        const exp = decoded.exp * 1000; 
        const timeLeft = exp - Date.now();

      
        if (timeLeft <= 0) {
            AuthStore.getState().logout();
            window.location.href = "/";
            return;
        }

        // Cerrar sesión automáticamente cuando expire
        setTimeout(() => {
            AuthStore.getState().logout();
            window.location.href = "/";
        }, timeLeft);
    } catch (err) {
        console.error("Error decodificando token:", err);
    }
}

