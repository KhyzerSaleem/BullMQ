import multer from "multer";
import fs from "fs";
import path from "path";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads", "original");

if (!fs.existsSync(UPLOADS_ROOT))
  fs.mkdirSync(UPLOADS_ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_ROOT);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const name = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${name}-${unique}${ext}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedMimes = /jpeg|jpg|png|webp/;
  const mimetypeOk = allowedMimes.test(file.mimetype);
  const extOk = allowedMimes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (mimetypeOk && extOk) cb(null, true);
  else
    cb(
      new Error("Invalid file type. Only JPG, PNG and WEBP images are allowed.")
    );
};

const limits = { fileSize: 5 * 1024 * 1024 };

const upload = multer({ storage, fileFilter: imageFileFilter, limits });

export const uploadSingleImage = upload.single("image");
