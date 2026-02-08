import authRoutes from './routes/auth.route';
import providerRouter from "./routes/provider.route";
import providerServiceRoute from './routes/provider/service.route';
import providerInventoryRoute from './routes/provider/inventory.route';
import petRouter from "./routes/pet.route";
import path from 'path';
import admiUserRoute from './routes/admin/user.route';
import adminPetRoute from './routes/admin/pet.route';
import adminProviderRoute from './routes/admin/provider.route';
import adminStatsRoute from './routes/admin/stats.route';
import adminBookingRoute from './routes/admin/booking.route';
import adminServiceRoute from './routes/admin/service.route';
import adminReviewRoute from './routes/admin/review.route';
import adminMessageRoute from './routes/admin/message.route';
import adminHealthRecordRoute from './routes/admin/healthrecord.route';
import adminFeedbackRoute from './routes/admin/feedback.route';
import adminInventoryRoute from './routes/admin/inventory.route';
import bookingRoute from './routes/booking.route';
import serviceRoute from './routes/service.route';
import reviewRoute from './routes/review.route';
import messageRoute from './routes/message.route';
import healthRecordRoute from './routes/healthrecord.route';
import attachmentRoute from './routes/attachment.route';
import feedbackRoute from './routes/feedback.route';
import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { de } from 'zod/v4/locales';
import multer from 'multer';
import { HttpError } from './errors/http-error';

const app: Application = express();

let corsOptions = {
    origin:["http://localhost:3000", "http://localhost:3001", "http://localhost:3003"],
    credentials: true, // Allow cookies to be sent
    // list of domains allowed to access the server
    // frontend domain/url
}

// origin: "*", allow all domians
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve static files from uploads directory

// app.use(cors());
app.use(cookieParser());
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
// Provider-managed services
app.use('/api/provider/service', providerServiceRoute);
// User Pet routes
app.use("/api/user/pet", petRouter);
// Admin User routes
app.use("/api/admin/users", admiUserRoute);
// Admin Pet routes
app.use("/api/admin/pet", adminPetRoute);
// Admin Provider routes
app.use("/api/admin/provider", adminProviderRoute);
// Admin Stats routes
app.use("/api/admin/stats", adminStatsRoute);
// Admin Booking routes
app.use('/api/admin/booking', adminBookingRoute);
// Admin Service routes
app.use('/api/admin/service', adminServiceRoute);
// Admin Review routes
app.use('/api/admin/review', adminReviewRoute);
// Admin Message routes
app.use('/api/admin/message', adminMessageRoute);
// Admin Health Record routes
app.use('/api/admin/health-record', adminHealthRecordRoute);
// Admin Feedback routes
app.use('/api/admin/feedback', adminFeedbackRoute);
// Admin Inventory routes
app.use('/api/admin/inventory', adminInventoryRoute);

// Booking routes
app.use('/api/booking', bookingRoute);

// Public Service routes
app.use('/api/service', serviceRoute);

// Review routes
app.use('/api/review', reviewRoute);
// Message routes
app.use('/api/message', messageRoute);
// Health Record routes
app.use('/api/health-record', healthRecordRoute);
// Attachment routes
app.use('/api/attachment', attachmentRoute);
// Feedback routes
app.use('/api/feedback', feedbackRoute);
// Provider Inventory routes
app.use('/api/provider/inventory', providerInventoryRoute);

// Error handling middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode || 400).json({
            success: false,
            message: err.message || "Bad Request"
        });
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message || "File upload error"
        });
    }

    if (err instanceof Error) {
        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});


export default app;