import { Request, Response } from "express";
import { BookingService } from "../../services/booking.service";

const bookingService = new BookingService();

export class AdminBookingController {
    async createBooking(req: Request, res: Response) {
        try {
            // admin can create booking for any user - userId expected in body
            const userId = req.body.userId;
            const booking = await bookingService.createBooking(req.body, userId);
            return res.status(201).json(booking);
        } catch (err: any) {
            return res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    async getAllBookings(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await bookingService.getAllBookings(page, limit);
            return res.json(result);
        } catch (err: any) {
            return res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    async getBookingById(req: Request, res: Response) {
        try {
            const booking = await bookingService.getBookingById(req.params.id);
            return res.json(booking);
        } catch (err: any) {
            return res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    async updateBooking(req: Request, res: Response) {
        try {
            const updated = await bookingService.updateBooking(req.params.id, req.body);
            return res.json(updated);
        } catch (err: any) {
            return res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    async deleteBooking(req: Request, res: Response) {
        try {
            const deleted = await bookingService.deleteBooking(req.params.id);
            return res.json({ success: true, deleted });
        } catch (err: any) {
            return res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }
}

export default new AdminBookingController();
