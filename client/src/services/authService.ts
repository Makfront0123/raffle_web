import { api } from "@/api/api";

export class AuthService {
    async getUserByGoogle({ token }: { token: string }) {
        const res = await api.post("/api/auth/google", { token });
        return res.data;
    }

    async persist() {
        const res = await api.get("/api/auth/persist");
        return res.data;
    }


    async loginAdmin({ email, password }: { email: string; password: string }) {
        const res = await api.post("/api/auth/admin/login", { email, password });
        return res.data;
    }

    async registerAdmin({ name, email, password }: { name: string; email: string; password: string }) {
        const res = await api.post("/api/auth/admin/setup", { name,email, password });
        return res.data;
    }


    async refreshToken(refreshToken: string) {
        const res = await api.post("/api/auth/refresh", { refreshToken });
        return res.data;
    }


    async logout() {
        await api.post("/api/auth/logout");
    }
}
