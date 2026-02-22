import { Router, Request, Response } from 'express';
import { documentUploads, uploads } from '../middleware/upload.middleware';
import { authorizedMiddleware, providerMiddleware } from '../middleware/authorization.middleware';

const router = Router();

// POST /api/upload-profile-image
router.post('/upload-profile-image', authorizedMiddleware, uploads.single('profile_image'), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully.',
        data: {
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
        },
    });
});

// POST /api/upload/provider-certificate
router.post(
    '/provider-certificate',
    authorizedMiddleware,
    providerMiddleware,
    documentUploads.single('certification_document'),
    (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No certificate file uploaded.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Provider certificate uploaded successfully.',
            data: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: `/uploads/${req.file.filename}`,
                mimetype: req.file.mimetype,
                size: req.file.size,
            },
        });
    }
);

export default router;
