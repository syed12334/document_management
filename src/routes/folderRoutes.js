const express = require('express');
const router = express.Router();

const folderController = require('../controllers/FolderController');
const auth = require('../middlewares/auth.middleware');
const {validateFolderRequest} =require("../middlewares/folderMiddleware");
const {
    checkPermission
} = require("../middlewares/permissions.middleware");
const {
    createFolderValidator,
    updateFolderValidator
} = require("../validations/folderValidator");
router.use(auth);
router.get('/',checkPermission('view-folder'), folderController.index);
router.get('/create',checkPermission('add-folder'),folderController.createForm);
router.post('/store',checkPermission('add-folder'),createFolderValidator,validateFolderRequest('add'), folderController.store);
// Delete folder
router.get(
  '/:id',
  checkPermission('delete-folder'),
  folderController.destroy
);
router.get(
  '/:id/edit',
  checkPermission('edit-folder'),
  folderController.editForm
);

router.get(
  '/:id/view',
   checkPermission('view-folder'),
  folderController.view
);

// Update folder
router.post(
  '/:id/update',
  updateFolderValidator,
  validateFolderRequest('edit'),
  folderController.update
);
module.exports = router;
