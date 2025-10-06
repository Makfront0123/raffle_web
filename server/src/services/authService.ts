import { User } from "../entities/user.entity";
import { userRepository } from "../repositories/userRepository";



export class AuthService {
    async findOrCreateUser(googleUser: User): Promise<{ user: User; isNew: boolean }> {
        const USER_ROLE_ID = 2;

        let user = await userRepository.findByEmail(googleUser.email);
        let isNew = false;

        if (!user) {
            user = await userRepository.createUser({
                name: googleUser.name,
                email: googleUser.email,
                picture: googleUser.picture,
                roleId: USER_ROLE_ID,
            });
            isNew = true;
        }

        return { user, isNew };
    }
}
