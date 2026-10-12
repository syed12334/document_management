const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth.middleware');

const documentController =
    require('../controllers/DocumentController');

const {
    upload,
    handleUpload
} = require('../middlewares/upload.middleware');

const {
    createDocumentValidation,
    updateDocumentValidation
} = require('../validations/documentValidator');
const {
    checkPermission
} = require("../middlewares/permissions.middleware");
const csrf = require('csurf');
const csrfProtection = csrf();
router.use(auth);

// Document list
router.get(
    '/',
    checkPermission('view-document'),
    documentController.index
);

// Upload form
router.get(
    '/create',
    checkPermission('add-document'),
    documentController.create
);

// Upload document
router.post(
    '/saveFile',
    checkPermission('add-document'),
    handleUpload('document'),  
    createDocumentValidation,
    documentController.saveFile
);

// View document
router.get(
    '/view/:id',
    checkPermission('view-document'),
    documentController.show
);

// Edit
router.get(
    '/:id/edit',
    checkPermission('edit-document'),
    documentController.edit
);

//Update
router.post(
    '/update/:id',
    checkPermission('edit-document'),
    handleUpload('document'),
    csrfProtection,
    updateDocumentValidation,
    documentController.update
);


// Delete
router.get(
    '/delete/:id',
    checkPermission('delete-document'),
    documentController.destroy
);
router.get('/:id/preview', documentController.preview);
module.exports = router;