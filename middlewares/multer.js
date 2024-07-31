import multer from 'multer';
import path from 'path';
import { tmpdir } from 'os';

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpdir()); // Store files in the system's temporary directory
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize multer
const upload = multer({ storage });

export default upload;
