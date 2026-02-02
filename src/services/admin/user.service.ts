import { UserRepository } from "../../repositories/user.repository";
import { CreateUserDTO } from "../../dtos/user.dto";
import { HttpError } from "../../errors/http-error";
let userRepository = new UserRepository();

export class AdminUserService {
    async createUser(data: CreateUserDTO) {
        // logic to create a user by admin 
        // const existingUser = await userRepository.findByEmail(data.email);
        // if (existingUser) {
        //     throw new HttpError(400, "User with this email already exists");
        // }
        // const newUser = await userRepository.create(data);
        // return newUser;

    }

    async getAllUsers() {
        let users = await userRepository.getAllUsers();
        return users;
    }
    async getUserById(id: string) {
        let user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        return user;
    }
    

}