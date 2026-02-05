import { CreateUserDTO, UpdateUserDto } from "../../dtos/user.dto";
import z from "zod";
import { Request, Response } from "express";
import { AdminUserService } from "../../services/admin/user.service";

let adminUserService = new AdminUserService();

export class AdminUserController {
    async createUser(req: Request, res: Response) {
        try {
            const paresedResult = CreateUserDTO.safeParse(req.body);
            if (!paresedResult.success) {
                return res.status(400).json({ 
                    success: false, message: z.prettifyError(paresedResult.error) 
                });
               
            }
            const newUser = await adminUserService.createUser(paresedResult.data);
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                data: newUser
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            }); 
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const users = await adminUserService.getAllUsers(page, limit);
            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: users
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await adminUserService.getUserById(userId);
            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: user
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const parsedResult = UpdateUserDto.safeParse(req.body);
            if (!parsedResult.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedResult.error)
                });
            }
            const updatedUser = await adminUserService.updateUser(userId, parsedResult.data);
            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: updatedUser
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const deletedUser = await adminUserService.deleteUser(userId);
            return res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: deletedUser
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
}