import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectdb } from './database/mongodb';
import { PORT } from './config';
import authRoutes from './routes/auth.route';
import providerRouter from "./routes/provider.route";
import path from 'path';

const app: Application = express();

let corsOptions = {
    origin:["http://localhost:3000", "http://localhost:3003"],
    // list of domains allowed to access the server
    // frontend domain/url
}

// origin: "*", allow all domians
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve static files from uploads directory

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request/response logging middleware
app.use((req: Request, res: Response, next) => {
    const startTime = Date.now();
    const originalJson = res.json.bind(res);
    let responseBody: unknown;

    res.json = (body: unknown) => {
        responseBody = body;
        return originalJson(body);
    };

    res.on('finish', () => {
        const durationMs = Date.now() - startTime;
        const logPayload: Record<string, unknown> = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            durationMs,
        };

        if (responseBody && typeof responseBody === 'object') {
            const bodyObj = responseBody as Record<string, unknown>;
            if ('success' in bodyObj) logPayload.success = bodyObj.success;
            if ('message' in bodyObj) logPayload.message = bodyObj.message;
            if ('data' in bodyObj) logPayload.data = bodyObj.data;
        }

        try {
            console.log('[HTTP]', JSON.stringify(logPayload));
        } catch {
            console.log('[HTTP]', logPayload);
        }
    });

    next();
});

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'PawCare API is running!' });
});

// Auth routes
app.use('/api/auth', authRoutes);
// Provider routes
app.use("/api/provider", providerRouter);

async function startServer() {
    await connectdb();
    app.listen(PORT, () => {
        console.log(`Server is running: http://localhost:${PORT}`);
    });
}

startServer();