import { Router, Request, Response } from "express";
import adminBookingController from "../../controller/admin/booking.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middleware/authorization.middleware";

const router: Router = Router();

router.post("/", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
  adminBookingController.createBooking(req, res)
);

router.get("/", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
  adminBookingController.getAllBookings(req, res)
);

router.get("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
  adminBookingController.getBookingById(req, res)
);

router.put("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
  adminBookingController.updateBooking(req, res)
);

router.delete("/:id", authorizedMiddleware, adminMiddleware, (req: Request, res: Response) =>
  adminBookingController.deleteBooking(req, res)
);

export default router;
