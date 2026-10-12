const { body, validationResult } = require('express-validator');

const createDocumentValidation = [
    body('folder_id')
        .notEmpty().withMessage('Please select a folder'),

    (req, res, next) => {
        const result = validationResult(req);
        const errors = result.isEmpty() ? {} : result.mapped();

        // Fold in the multer file error (from handleUpload) as if it were
        // a validation error on the "document" field
        if (req.fileError) {
            errors.document = { msg: req.fileError };
        } else if (!req.file) {
            errors.document = { msg: 'Please choose a file to upload' };
        }

        if (Object.keys(errors).length > 0) {
            req.session.errors = errors;
            req.session.oldInput = req.body;
            return res.redirect(req.originalUrl.includes('/saveFile')
                ? '/documents/create'
                : `/documents/${req.params.id}/edit`);
        }

        next();
    }
];

const updateDocumentValidation = [
    body('folder_id')
        .notEmpty().withMessage('Please select a folder'),

    (req, res, next) => {
        const result = validationResult(req);
        const errors = result.isEmpty() ? {} : result.mapped();

        // On update, a new file is optional — only surface an error
        // if multer actually reported one (e.g. wrong type/size)
        if (req.fileError) {
            errors.document = { msg: req.fileError };
        }

        if (Object.keys(errors).length > 0) {
            req.session.errors = errors;
            req.session.oldInput = req.body;
            return res.redirect(`/documents/${req.params.id}/edit`);
        }

        next();
    }
];

module.exports = { createDocumentValidation, updateDocumentValidation };