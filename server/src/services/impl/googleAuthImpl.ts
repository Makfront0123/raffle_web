import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      // Omitimos el client_id por ahora (solo para desarrollo)
      // audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return payload; // Aquí tienes email, name, picture, etc.
  } catch (error) {
    console.error("Error verificando token:", error);
    throw new Error("Token inválido");
  }
};