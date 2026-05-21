import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, 'uploads/profiles');
  },
  filename(_req, file, callback) {
    const extension = path.extname(file.originalname);
    callback(null, `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

function fileFilter(_req, file, callback) {
  if (!file.mimetype.startsWith('image/')) {
    return callback(new Error('Only image uploads are allowed'));
  }

  callback(null, true);
}

export const uploadProfilePhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});
