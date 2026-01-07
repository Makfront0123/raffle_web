export interface JwtPayload {
  id: number;
  email: string;
}

export interface MyTokenPayload {
  id: number;
  roleId: number;
  email?: string;
  name?: string;
  picture?: string;
}
