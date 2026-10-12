const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
];

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // 'image/jpeg',
    // 'image/png'
];

const uploadDir = path.join(
    process.cwd(),
    'storage',
    'documents'
);

fs.mkdirSync(uploadDir, {
    recursive: true
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const randomName = crypto
            .randomBytes(32)
            .toString('hex');

        cb(
            null,
            `${randomName}${extension}`
        );
    }
});

// NOTE: multer always invokes fileFilter as (req, file, cb) — exactly 3 args.
// The previous signature (req, res, file, cb) silently shifted every
// parameter by one: `file` was actually multer's `cb`, and the real `cb`
// was undefined, so cb(err) at the bottom would throw. This middleware
// also must not touch `res` — that's the job of whatever runs after
// handleUpload, using req.fileError.
const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        const err = new Error(
            `Unsupported file extension "${extension}". Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
        );
        err.code = 'INVALID_FILE_TYPE';
        return cb(err);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        const err = new Error(`Unsupported file type "${file.mimetype}".`);
        err.code = 'INVALID_FILE_TYPE';
        return cb(err);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
    },
    fileFilter
});

// Wraps upload.single('document') so multer errors (bad type, too large)
// become req.fileError instead of crashing / hanging the request.
function handleUpload(fieldName) {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                if (err.code === 'INVALID_FILE_TYPE') {
                    req.fileError = err.message;
                } else if (err.code === 'LIMIT_FILE_SIZE') {
                    req.fileError = `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`;
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    // Now genuinely means: field name in the form doesn't
                    // match upload.single('document'), or more than one
                    // file was sent under that field.
                    req.fileError = 'Unexpected upload field. Please try again.';
                } else if (err instanceof multer.MulterError) {
                    req.fileError = 'File upload failed. Please try again.';
                } else {
                    return next(err); // truly unexpected — bubble to global handler
                }
            }
            next();
        });
    };
}

module.exports = {
    upload,
    handleUpload,
    MAX_FILE_SIZE,
    ALLOWED_EXTENSIONS
};