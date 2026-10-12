const express = require('express');
const router = express.Router();

const roleController = require('../controllers/RoleController');
const auth = require('../middlewares/auth.middleware');
const { validateRoleRequest } = require("../middlewares/roleMiddleware");
const {
    checkPermission
} = require("../middlewares/permissions.middleware");
const {
    createRoleValidator,
    updateRoleValidator
} = require("../validations/roleValidator"); // consider renaming this file to roleValidator.js if it's role-specific

router.use(auth);

router.get('/', checkPermission('view-role'), roleController.index);
router.get('/create', checkPermission('add-role'), roleController.createForm);

router.post(
  '/store',
  checkPermission('add-role'),
  createRoleValidator,      // fixed: was createFolderValidator (undefined)
  validateRoleRequest('add'),      // fixed: was validateFolderRequest (undefined)
  roleController.store
);

// Delete role
router.get(
  '/delete/:id',
  checkPermission('delete-role'),
  roleController.destroy
);

router.get(
  '/:id/edit',
  checkPermission('edit-role'),
  roleController.editForm
);

router.get(
  '/:id/view',
  checkPermission('view-role'),
  roleController.view
);

// Update role
router.post(
  '/:id/update',
  checkPermission('edit-role'),
  updateRoleValidator,
  validateRoleRequest('edit'),
  roleController.update      // fixed: was folderController.update (undefined)
);

module.exports = router;