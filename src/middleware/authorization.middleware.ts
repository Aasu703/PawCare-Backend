import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config";
import{IUser} from '../models/user/user.model';
import { IProvider } from '../models/provider/provider.model';
import { UserRepository } from "../repositories/user/user.repository";
import { ProviderRepository } from "../repositories/provider/provider.repository";
import { HttpError } from "../errors/http-error";

let userRepository=new UserRepository();
let providerRepository=new ProviderRepository();
declare global{
    namespace Express{
        interface Request{
            user?:Record<string,any>| IUser;
            provider?:Record<string,any>| IProvider;
        }
    }
}
//creating a tag for user
//can use req.user in other files

export async function authorizedMiddleware(req:Request,res:Response,next:NextFunction){
    try{
        let token: string | undefined;
        
        // Check Authorization header first
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } 
        // If no Authorization header, check for auth_token cookie
        else if (req.cookies && req.cookies.auth_token) {
            token = req.cookies.auth_token;
        }
        
        if (!token) {
            throw new HttpError(401, 'Authorization token missing');
        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as Record<string, any>;//decoded -> payload
        if (!decoded || !decoded.id)
            throw new HttpError(401, 'Invalid token');
        
        // Check if this is a provider token
        if (decoded.role === 'provider') {
            const provider = await providerRepository.getProviderById(decoded.id);
            if (!provider)
                throw new HttpError(401, 'Provider not found');
            req.provider = provider;
            req.user = { ...provider.toObject(), role: 'provider' } as any;
            return next();
        }
        
        const user = await userRepository.getUserById(decoded.id);//make async if needed
        if (!user)
            throw new HttpError(401, 'User not found');
        req.user = user;
        return next();
    }
    catch(err: Error | any){
        return next(err instanceof HttpError ? err : new HttpError(401, err.message || 'Unauthorized'));
    }
            
}   

export async function adminMiddleware(req:Request,res:Response,next:NextFunction){
    try{
        const user=req.user;
        if(!user)
            throw new HttpError(401,'Unauthorized');
        if(user.role !== 'admin')
            throw new HttpError(403,'Forbidden: Admins only');
        return next();
    }
    catch(err: Error | any){
        return next(err instanceof HttpError ? err : new HttpError(500, err.message || 'Unauthorized'));
    }
}

export async function providerMiddleware(req:Request,res:Response,next:NextFunction){
    try{
        const user=req.user;
        if(!user)
            throw new HttpError(401,'Unauthorized');
        if(user.role !== 'provider')
            throw new HttpError(403,'Forbidden: Providers only');
        return next();
    }
    catch(err: Error | any){
        return next(err instanceof HttpError ? err : new HttpError(500, err.message || 'Unauthorized'));
    }
}

export function requireRoles(...roles: Array<'user' | 'provider' | 'admin'>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = (req.user as Record<string, unknown> | undefined)?.role;
        if (!role) {
            return next(new HttpError(401, 'Unauthorized'));
        }
        if (!roles.includes(role as 'user' | 'provider' | 'admin')) {
            return next(new HttpError(403, 'Forbidden'));
        }
        return next();
    };
}