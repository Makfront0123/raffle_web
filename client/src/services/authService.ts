// src/services/authService.ts
import axios from "axios";

export class AuthService {
    async getUserByGoogle({ token }: { token: string }) {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
            { token }
        );
        return res.data;
    }

    // src/services/authService.ts
    async getUserByToken(token: string) {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/persist`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return res.data;
    }

}
