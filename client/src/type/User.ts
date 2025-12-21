interface User {
    id?: number;
    email?: string;
    role?: string;
    name?: string;
    picture?: string;
    phone_number?: string;
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}