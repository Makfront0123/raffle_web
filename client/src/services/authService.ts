import axios from "axios";


export class AuthService {
    async getUserByGoogle({ token }: { token: string }) {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
            { token }
        );
        return res.data;
    }


    async getUserByToken(token: string) {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/persist`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return res.data;
    }

    async devLogin(email: string) {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/dev-login`,
            { email }
        );
        return res.data; // { user, token }
    }

    async refreshToken(refreshToken: string) {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
            { refreshToken }
        );
        return res.data;
    }
}
