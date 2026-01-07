export interface GoogleUserData {
  id?: number;
  roleId?: number;
  name: string;
  email: string;
  picture?: string;
  role?: {
    id: number;
    name: string;
  };
}
