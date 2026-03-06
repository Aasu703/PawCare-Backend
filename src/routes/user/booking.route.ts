import { Router } from "express";
import BookingController from "../../controller/user/booking.controller";
import { authorizedMiddleware } from "../../middleware/authorization.middleware";

const router = Router();

// create booking - must be authenticated so req.user is available
router.post("/", authorizedMiddleware, BookingController.create);
// alias route for clients that use /create
router.post("/create", authorizedMiddleware, BookingController.create);
router.get("/", authorizedMiddleware, BookingController.list);

// Current user's bookings
router.get("/my", authorizedMiddleware, (req, res, next) => {
    req.params.userId = (req as any).user?.id || (req as any).user?._id?.toString();
    BookingController.listByUser(req, res, next);
});

// bookings by user (authenticated or admin)
router.get("/user/:userId", authorizedMiddleware, BookingController.listByUser);

router.get("/:id", authorizedMiddleware, BookingController.getById);
router.put("/:id", authorizedMiddleware, BookingController.update);
router.delete("/:id", authorizedMiddleware, BookingController.remove);

export default router;
