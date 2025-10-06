import { JwtPayload } from 'google-auth-library';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload | Record<string, any>;
    }
  }
}
