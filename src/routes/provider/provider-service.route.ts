import { Router } from "express";
import providerServiceController from "../../controller/provider/provider-service.controller";
import { authorizedMiddleware, providerMiddleware } from "../../middleware/authorization.middleware";
import { uploads } from "../../middleware/upload.middleware";
import { requireServiceOwnership } from "../../middleware/service-authorization.middleware";

const router = Router();

router.post(
    "/apply",
    authorizedMiddleware,
    providerMiddleware,
    uploads.fields([
        { name: "medicalLicenseDocument", maxCount: 1 },
        { name: "certificationDocument", maxCount: 1 },
        { name: "facilityImages", maxCount: 10 },
        { name: "businessRegistrationDocument", maxCount: 1 },
    ]),
    (req, res) => providerServiceController.apply(req, res)
);

router.get("/my", authorizedMiddleware, providerMiddleware, (req, res) =>
    providerServiceController.listMine(req, res)
);

router.get(
    "/:id",
    authorizedMiddleware,
    providerMiddleware,
    requireServiceOwnership("id"),
    (req, res) => providerServiceController.getById(req, res)
);

export default router;
