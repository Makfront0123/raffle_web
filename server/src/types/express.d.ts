import "express";
import { JwtPayload } from "google-auth-library";

declare global {
  namespace Express {
    interface AuthUserPayload extends JwtPayload {
      id?: number;
      email?: string;
      roleId?: number;
      name?: string;
      picture?: string;
    }

    interface Request {
      user?: AuthUserPayload;
    }
  }
}
