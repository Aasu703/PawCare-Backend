import { CreateUserDTO, LoginUserDTO, UpdateUserDto } from "../dtos/user.dto";
import bcryptjs from "bcryptjs";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { UserRepository } from "../repositories/user.repository";


let userRepository = new UserRepository();
import { sendEmail } from "../config/email";
const CLIENT_URL = process.env.CLIENT_URL as string;

export class UserService {
    async createUser(data: CreateUserDTO){
        const emailCheck = await userRepository.getUserByEmail(data.email);
        if(emailCheck){
            throw new HttpError(403, "Email is already in use");
        }
        const firstNameCheck = await userRepository.getUserByFullName(data.Firstname);
        if(firstNameCheck){
            throw new HttpError(403,"Please enter a proper name");
        }
         const lastNameCheck = await userRepository.getUserByFullName(data.Lastname);
        if(lastNameCheck){
            throw new HttpError(403,"Please enter a proper name");
        }
        const hashedPassword = await bcryptjs.hash(data.password, 10)
        data.password = hashedPassword;

        const newUser = await userRepository.createUser(data);
        return newUser;
    }

    async loginUser(data: LoginUserDTO){
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        const validPassword = await bcryptjs.compare(data.password, user.password);
        if(!validPassword){
            throw new HttpError(401, "Invalid credentials");
        }
        const payload = {
            id: user._id,
            email:user.email,
            Firstname:user.Firstname,
            Lastname:user.Lastname,
            role: user.role,
            phone:user.phone
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d'});
        return { token, user };
    }

    async getUserById(userId: string){
        if(!userId){
            throw new HttpError(400, "User ID is required");
        }
        const user = await userRepository.getUserById(userId);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        return user;
    }
    async makeAdmin(userId: string){
        if(!userId){
            throw new HttpError(400, "User ID is required");
        }
        const user = await userRepository.getUserById(userId);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        user.role = "admin";
        const updatedUser = await userRepository.updateAdminRole(userId, "admin");
        return updatedUser;
    }

    async updateUser(userId: string, data: UpdateUserDto){
        const user = await userRepository.getUserById(userId);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        if(data.email && user.email !== data.email){
            const emailExists = await userRepository.getUserByEmail(data.email);
            if(emailExists){
                throw new HttpError(409, "Email already exists");
            }
        }
        if(data.password){
            const hashedPassword = await bcryptjs.hash(data.password, 10);
            data.password = hashedPassword;
        }
        const updatedUser = await userRepository.updateUserById(userId, data);
        return updatedUser;
    }
    async sendResetPasswordEmail(email?: string) {
        if (!email) {
            throw new HttpError(400, "Email is required");
        }
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); // 1 hour expiry
        const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
        const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;
        await sendEmail(user.email, "Password Reset", html);
        return user;

    }

    async resetPassword(token?: string, newPassword?: string) {
        try {
            if (!token || !newPassword) {
                throw new HttpError(400, "Token and new password are required");
            }
            const decoded: any = jwt.verify(token, JWT_SECRET);
            const userId = decoded.id;
            const user = await userRepository.getUserById(userId);
            if (!user) {
                throw new HttpError(404, "User not found");
            }
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            await userRepository.updateUserById(userId, { password: hashedPassword });
            return user;
        } catch (error) {
            throw new HttpError(400, "Invalid or expired token");
        }
    }

}