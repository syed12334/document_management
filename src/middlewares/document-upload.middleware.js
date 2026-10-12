const multer = require('multer');

const {
    upload
} = require('./upload.middleware');

const {
    Folder
} = require('../models');

const uploadDocument = (req, res, next) => {

    upload.single('document')(
        req,
        res,
        async (error) => {

            if (!error) {
                return next();
            }

            const errors = {};

            if (error.code === 'LIMIT_FILE_SIZE') {

                errors.document =
                    'Maximum file size is 10 MB.';

            } else if (
                error.code === 'LIMIT_UNEXPECTED_FILE'
            ) {

                errors.document =
                    'Invalid file type.';

            } else {

                errors.document =
                    error.message ||
                    'File upload failed.';
            }

            const folders = await Folder.findAll({
                order: [
                    ['name', 'ASC']
                ]
            });

            return res.status(422).render(
                'documents/create',
                {
                    title: 'Upload Document',

                    folders,

                    formData: {
                        folder_id:
                            req.body?.folder_id || ''
                    },

                    errors
                }
            );
        }
    );
};

module.exports = uploadDocument;