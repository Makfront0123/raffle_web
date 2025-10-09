interface User {
    id?: number;
    email?: string;
    role?: {
        id: number;
        name: string;
    };
    name?: string;
    picture?: string;
}