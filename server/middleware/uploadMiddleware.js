import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "media-connect/posts",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        resource_type: "auto",
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        fieldSize: 50 * 1024 * 1024, // 50MB for field values
        fieldNameSize: 100 * 1024, // 100KB for field names
    },
});

export const uploadMiddleware = (req, res, next) => {
    console.log("=== Upload Middleware Started ===");
    upload.single("media")(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err.message);
            return next(err);
        }
        console.log("Upload successful, file:", {
            originalname: req.file?.originalname,
            mimetype: req.file?.mimetype,
            size: req.file?.size,
            secure_url: req.file?.secure_url,
        });
        next();
    });
};

export const getMediaUrl = (req, res, next) => {
    console.log("=== getMediaUrl Middleware ===");
    
    if (req.file) {
        // Cloudinary storage returns the URL in secure_url
        const url = req.file.secure_url || req.file.path || req.file.url;
 
        req.mediaUrl = url;
    } else {
        console.log("✗ No file in request");
    }
    next();
};
