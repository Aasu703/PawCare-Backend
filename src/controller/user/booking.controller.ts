import { Request, Response, NextFunction } from "express";
import { BookingService } from "../../services/user/booking.service";

const bookingService = new BookingService();

export class BookingController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.id || req.body.userId;
            const booking = await bookingService.createBooking(req.body, userId);
            res.status(201).json(booking);
        } catch (err) { next(err); }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const booking = await bookingService.getBookingById(req.params.id);
            res.json(booking);
        } catch (err) { next(err); }
    }

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await bookingService.getAllBookings(page, limit);
            res.json(result);
        } catch (err) { next(err); }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const updated = await bookingService.updateBooking(req.params.id, req.body);
            res.json(updated);
        } catch (err) { next(err); }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const deleted = await bookingService.deleteBooking(req.params.id);
            res.json({ success: true, deleted });
        } catch (err) { next(err); }
    }

    async listByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId || (req as any).user?.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await bookingService.getBookingsByUserId(userId, page, limit);
            res.json(result);
        } catch (err) { 
            console.error('Error in listByUser:', err);
            next(err); 
        }
    }

    async listByProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const providerId = (req as any).provider?._id?.toString() || req.params.providerId;
            if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized" });
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await bookingService.getBookingsByProviderId(providerId, page, limit);
            res.json({ success: true, data: result });
        } catch (err) { next(err); }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const providerId = (req as any).provider?._id?.toString();
            if (!providerId) return res.status(401).json({ success: false, message: "Unauthorized" });
            const { status } = req.body;
            const updated = await bookingService.updateBookingStatus(req.params.id, providerId, status);
            res.json({ success: true, message: `Booking ${status}`, data: updated });
        } catch (err) { next(err); }
    }
}

export default new BookingController();
