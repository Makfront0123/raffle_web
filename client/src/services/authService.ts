export class AuthService {
    async getUserByGoogle(googleUser: GoogleUserData): Promise<User> {
        const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(googleUser),
        });

        if (!response.ok) {
            throw new Error("Error al obtener el usuario");
        }

        const user = await response.json();
        return user;
    }
}