export class AuthService {
  async getUserByGoogle(googleUser: { token: string }): Promise<AuthResponse> {
    const url = import.meta.env.PUBLIC_BACKEND_URL + "/api/auth/google";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${googleUser.token}`,
      },
      body: JSON.stringify({ credential: googleUser.token }),
    });

    if (!response.ok) throw new Error("Error al obtener el usuario");

    return response.json() as Promise<AuthResponse>;
  }
}
