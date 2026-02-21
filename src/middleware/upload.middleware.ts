import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { HttpError } from "../errors/http-error";
// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// const upload = multer({ dest: 'uploads/' }); // or configure as needed


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const extension = path.extname(file.originalname);
        cb(null, uniqueSuffix + extension);
    }
});

const imageFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/heic',
        'image/heif',
    ];
    const allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) && allowedExt.includes(extension)) {
        cb(null, true);
    } else {
        cb(new HttpError(400, 'Invalid file type. Only image files are allowed.'));
    }
};
export const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const documentFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
    ];
    const allowedExt = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) && allowedExt.includes(extension)) {
        cb(null, true);
    } else {
        cb(new HttpError(400, 'Invalid file type. Only PDF and image files are allowed.'));
    }
};

export const uploadDocument = multer({
    storage: storage,
    fileFilter: documentFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploads = {
    single: (fieldName: string) => upload.single(fieldName),
    array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
    fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray)
};

export const documentUploads = {
    single: (fieldName: string) => uploadDocument.single(fieldName),
    array: (fieldName: string, maxCount: number) => uploadDocument.array(fieldName, maxCount),
    fields: (fieldsArray: { name: string; maxCount?: number }[]) => uploadDocument.fields(fieldsArray)
};
