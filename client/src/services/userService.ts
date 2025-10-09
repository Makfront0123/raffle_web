
export class UserService {
    async getUser(): Promise<User> {
        const response = await fetch("/api/user");
        if (!response.ok) {
            throw new Error("Error obteniendo usuario");
        }
        const user = await response.json();
        return user;
    }   
    async updateUser(user: User): Promise<User> {
        const response = await fetch("/api/user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error("Error actualizando usuario");
        }

        const updatedUser = await response.json();
        return updatedUser;
    }
    async deleteUser(id: number): Promise<void> {
        const response = await fetch(`/api/user/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Error eliminando usuario");
        }
    }
}