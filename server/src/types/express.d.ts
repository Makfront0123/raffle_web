// src/types/express.d.ts
import { User } from "../entities/user.entity"; // opcional, si quieres tiparlo exacto
import { TokenPayload } from "../types/jwt.types";
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
