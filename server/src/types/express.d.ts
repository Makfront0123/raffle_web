import "express";
import { JwtPayload } from "google-auth-library";

declare global {
  namespace Express {
    interface AuthUserPayload extends JwtPayload {
      id?: number;
      email?: string;
      role?: {
        id: number;
        name: string;
      };
      name?: string;
      picture?: string;
    }

    interface Request {
      user?: AuthUserPayload;
    }
  }
}
