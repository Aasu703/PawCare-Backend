import dotenv from 'dotenv';
dotenv.config();

const toNumber = (value: string | undefined, fallback: number) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value: string | undefined, fallback: string[]) => {
	if (!value) {
		return fallback;
	}

	return value
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean);
};

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const PORT = toNumber(process.env.PORT, 3000);
export const MONGO_URI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/pawcare';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'pawcare';
export const JWT_ACCESS_EXPIRES_IN: string = process.env.JWT_ACCESS_EXPIRES_IN || '7d';
export const RESET_TOKEN_EXPIRES_IN: string = process.env.RESET_TOKEN_EXPIRES_IN || '1h';

export const CORS_ORIGINS = parseOrigins(process.env.CORS_ORIGINS, [
	'http://localhost:3000',
	'http://localhost:3001',
	'http://localhost:3003',
]);

export const RATE_LIMIT_WINDOW_MS = toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000);
export const RATE_LIMIT_MAX_REQUESTS = toNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 200);