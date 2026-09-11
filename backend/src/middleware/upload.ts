import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);

    const safeFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    cb(null, safeFilename);
  },
});

const fileFilter: multer.Options['fileFilter'] = (
  _req,
  file,
  cb,
) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const allowedExtensions =
    /\.(pdf|doc|docx)$/i;

  const isAllowed =
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.test(file.originalname);

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only PDF, DOC, and DOCX files are allowed.',
      ),
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export default upload;