import dotenv from 'dotenv';
import { parse } from 'path';
dotenv.config();

export const PORT = process.env.PORT? parseInt(process.env.PORT) : 3000;
export const MONGO_URI : string = process.env.MONGO_URI || 'mongodb://localhost:27017/pawcare';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'pawcare';  