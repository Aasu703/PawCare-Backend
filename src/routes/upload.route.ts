import { Router, Request, Response } from 'express';
import { uploads } from '../middleware/upload.middleware';
import { authorizedMiddleware } from '../middleware/authorization.middleware';

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

export default router;