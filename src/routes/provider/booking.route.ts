import { Router } from "express";
import BookingController from "../../controller/user/booking.controller";
import { authorizedMiddleware, providerMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

// Provider: list bookings assigned to them
router.get("/my", authorizedMiddleware, providerMiddleware, BookingController.listByProvider);

// Provider: update booking status (confirm, cancel, complete)
router.put("/:id/status", authorizedMiddleware, providerMiddleware, BookingController.updateStatus);

// Provider: get booking detail
router.get("/:id", authorizedMiddleware, providerMiddleware, BookingController.getById);

export default router;
