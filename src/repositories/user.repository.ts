import { UserModel, IUser } from "../models/user.model";
import { CreateUserDTO } from "../dtos/user.dto";

export class UserRepository {
	async createUser(data: CreateUserDTO): Promise<IUser> {
		const user = await UserModel.create({
			email: data.email,
			password: data.password,
			firstName: data.firstName,
			lastName: data.lastName,
			phone: data.phone,
		});
		return user;
	}

	async getUserByEmail(email: string): Promise<IUser | null> {
		return UserModel.findOne({ email }).exec();
	}

	async getUserByFullName(fullName: string): Promise<IUser | null> {
		return UserModel.findOne({ fullName }).exec();
	}

	async getUserById(id: string): Promise<IUser | null> {
		return UserModel.findById(id).exec();
	}

	async updateUserById(id: string, updates: Partial<Pick<IUser, "email" | "password" | "firstName" | "lastName" | "phone" | "role">>): Promise<IUser | null> {
		return UserModel.findByIdAndUpdate(id, updates, { new: true }).exec();
	}

	async deleteUserById(id: string): Promise<IUser | null> {
		return UserModel.findByIdAndDelete(id).exec();
	}
}

