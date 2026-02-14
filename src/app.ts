import authRoutes from './routes/user/auth.route';
import providerRouter from './routes/provider/provider.route';
import providerServiceRoute from './routes/provider/service.route';
import providerServiceApplicationRoute from './routes/provider/provider-service.route';
import providerInventoryRoute from './routes/provider/inventory.route';
import petRouter from './routes/pet/pet.route';
import path from 'path';
import admiUserRoute from './routes/admin/user.route';
import adminPetRoute from './routes/admin/pet.route';
import adminProviderRoute from './routes/admin/provider.route';
import adminStatsRoute from './routes/admin/stats.route';
import adminBookingRoute from './routes/admin/booking.route';
import adminServiceRoute from './routes/admin/service.route';
import adminProviderServiceRoute from './routes/admin/provider-service.route';
import adminReviewRoute from './routes/admin/review.route';
import adminMessageRoute from './routes/admin/message.route';
import adminHealthRecordRoute from './routes/admin/healthrecord.route';
import adminFeedbackRoute from './routes/admin/feedback.route';
import adminInventoryRoute from './routes/admin/inventory.route';
import bookingRoute from './routes/user/booking.route';
import serviceRoute from './routes/public/service.route';
import reviewRoute from './routes/user/review.route';
import messageRoute from './routes/user/message.route';
import healthRecordRoute from './routes/pet/healthrecord.route';
import attachmentRoute from './routes/pet/attachment.route';
import feedbackRoute from './routes/provider/feedback.route';
import orderRoute from './routes/user/order.route';
import adminOrderRoute from './routes/admin/order.route';
import providerPostRoute from './routes/provider/post.route';
import publicPostRoute from './routes/public/post.route';
import adminPostRoute from './routes/admin/post.route';
import providerBookingRoute from './routes/provider/booking.route';
import publicInventoryRoute from './routes/public/inventory.route';
import uploadRoute from './routes/upload.route';
import express, { Application, Request, Response, Router } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { CORS_ORIGINS, IS_PRODUCTION, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from './config';
import { errorHandler, notFoundHandler } from './middleware/error-handler.middleware';
import { responseStandardizer } from './utils/api-response';
import { requestLogger } from './utils/logger';

const app: Application = express();

app.set('trust proxy', 1);

app.use(
    cors({
        origin: CORS_ORIGINS,
        credentials: true,
    })
);

app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

app.use(
    rateLimit({
        windowMs: RATE_LIMIT_WINDOW_MS,
        max: RATE_LIMIT_MAX_REQUESTS,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Too many requests. Please try again later.',
            error: { code: 'RATE_LIMITED' },
        },
    })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(responseStandardizer);
app.use(requestLogger);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        message: 'PawCare API is running!',
        data: { env: IS_PRODUCTION ? 'production' : 'development' },
    });
});

function buildApiRouter() {
    const router = Router();

    router.use('/auth', authRoutes);
    router.use('/provider/inventory', providerInventoryRoute);
    router.use('/provider/service', providerServiceRoute);
    router.use('/provider/provider-service', providerServiceApplicationRoute);
    router.use('/provider', providerRouter);
    router.use('/user/pet', petRouter);
    router.use('/admin/users', admiUserRoute);
    router.use('/admin/pet', adminPetRoute);
    router.use('/admin/provider', adminProviderRoute);
    router.use('/admin/stats', adminStatsRoute);
    router.use('/admin/booking', adminBookingRoute);
    router.use('/admin/service', adminServiceRoute);
    router.use('/admin/provider-service', adminProviderServiceRoute);
    router.use('/admin/review', adminReviewRoute);
    router.use('/admin/message', adminMessageRoute);
    router.use('/admin/health-record', adminHealthRecordRoute);
    router.use('/admin/feedback', adminFeedbackRoute);
    router.use('/admin/inventory', adminInventoryRoute);
    router.use('/booking', bookingRoute);
    router.use('/service', serviceRoute);
    router.use('/review', reviewRoute);
    router.use('/message', messageRoute);
    router.use('/health-record', healthRecordRoute);
    router.use('/attachment', attachmentRoute);
    router.use('/feedback', feedbackRoute);
    router.use('/order', orderRoute);
    router.use('/admin/order', adminOrderRoute);
    router.use('/provider/post', providerPostRoute);
    router.use('/post', publicPostRoute);
    router.use('/admin/post', adminPostRoute);
    router.use('/provider/booking', providerBookingRoute);
    router.use('/product', publicInventoryRoute);
    router.use('/upload', uploadRoute);

    return router;
}

const apiRouter = buildApiRouter();
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
