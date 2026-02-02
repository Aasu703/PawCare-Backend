import { CreateUserDTO } from "../../dtos/user.dto";
import z, { success } from "zod";
import { Request, Response } from "express";
import { UserService } from "../../services/user.service";
import { ca } from "zod/v4/locales";

let userService = new UserService();

export class AdminUserController {
    async createUser(req: Request, res: Response) {
        try {
            const paresedResult = CreateUserDTO.safeParse(req.body);
            if (!paresedResult.success) {
                return res.status(400).json({ 
                    success: false, message: z.prettifyError(paresedResult.error) 
                });
               
            }
            const newUser = await userService.createUser(paresedResult.data);
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
}