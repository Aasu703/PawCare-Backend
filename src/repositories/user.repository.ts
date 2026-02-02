import { UserModel, IUser } from "../models/user.model";
import { CreateUserDTO } from "../dtos/user.dto";

export class UserRepository {
    async createUser(data: CreateUserDTO): Promise<IUser> {
        const user = await UserModel.create({
            email: data.email,
            password: data.password,
            Firstname: data.Firstname,
            Lastname: data.Lastname,
            phone: data.phone,
            role: data.role
        });
        return user;
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email }).exec();
    }

    async getUserByFullName(fullName: string): Promise<IUser | null> {
        return UserModel.findOne({ fullName }).exec();
    }
    async getAllUsers(){
        const users = await UserModel.find();
        return users;
    }

    async getUserById(id: string): Promise<IUser | null> {
        return UserModel.findById(id).exec();
    }

    async updateUserById(id: string, updates: Partial<Pick<IUser, "email" | "password" | "Firstname" | "Lastname" | "phone" | "role" | "imageUrl">>): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async deleteUserById(id: string): Promise<IUser | null> {
        return UserModel.findByIdAndDelete(id).exec();
    }

    async updateAdminRole(id: string, role: "user" | "admin" | "provider"): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
    }

}