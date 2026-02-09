import { UserRepository } from "../../repositories/user/user.repository";
import { CreateUserDTO, UpdateUserDto } from "../../dtos/user/user.dto";
import { HttpError } from "../../errors/http-error";
import bcryptjs from "bcryptjs";
let userRepository = new UserRepository();

export class AdminUserService {
    async createUser(data: CreateUserDTO) {
        const existingUser = await userRepository.getUserByEmail(data.email);
        if (existingUser) {
            throw new HttpError(409, "User with this email already exists");
        }
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        data.password = hashedPassword;
        const newUser = await userRepository.createUser(data);
        return newUser;
    }

    async getAllUsers(page: number = 1, limit: number = 10) {
        let users = await userRepository.getAllUsers(page, limit);
        return users;
    }
    async getUserById(id: string) {
        if (!id) {
            throw new HttpError(400, "User ID is required");
        }
        let user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        return user;
    }

    async updateUser(id: string, data: UpdateUserDto) {
        if (!id) {
            throw new HttpError(400, "User ID is required");
        }
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        if (data.email && data.email !== user.email) {
            const emailExists = await userRepository.getUserByEmail(data.email);
            if (emailExists) {
                throw new HttpError(409, "Email already exists");
            }
        }
        if (data.password) {
            const hashedPassword = await bcryptjs.hash(data.password, 10);
            data.password = hashedPassword;
        }
        const updatedUser = await userRepository.updateUserById(id, data);
        return updatedUser;
    }

    async deleteUser(id: string) {
        if (!id) {
            throw new HttpError(400, "User ID is required");
        }
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const deletedUser = await userRepository.deleteUserById(id);
        return deletedUser;
    }
    

}