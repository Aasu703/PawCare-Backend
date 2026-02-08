import { Router } from "express";
import BookingController from "../../controller/user/booking.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

// create booking - must be authenticated so req.user is available
router.post("/", authorizedMiddleware, BookingController.create);
// alias route for clients that use /create
router.post("/create", authorizedMiddleware, BookingController.create);
router.get("/", BookingController.list);
router.get("/:id", BookingController.getById);
router.put("/:id", authorizedMiddleware, BookingController.update);
router.delete("/:id", authorizedMiddleware, BookingController.remove);

// bookings by user (authenticated or admin)
router.get("/user/:userId", authorizedMiddleware, BookingController.listByUser);

export default router;
