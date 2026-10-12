const express = require('express');
const router = express.Router();

const permissionController = require('../controllers/PermissionController');
const auth = require('../middlewares/auth.middleware');
const { validatePermissionRequest } = require("../middlewares/permissionMiddleware");
const {
    checkPermission
} = require("../middlewares/permissions.middleware");
const {
    createPermissionValidator,
    updatePermissionValidator
} = require("../validations/permissionValidator"); 
router.use(auth);

router.get('/', checkPermission('view-permission'), permissionController.index);
router.get('/create', checkPermission('add-permission'), permissionController.createForm);

router.post(
  '/store',
  checkPermission('add-permission'),
  createPermissionValidator,    
  validatePermissionRequest,     
  permissionController.store
);

// Delete permission
router.get(
  '/delete/:id',
  checkPermission('delete-permission'),
  permissionController.destroy
);

router.get(
  '/:id/edit',
  checkPermission('edit-permission'),
  permissionController.editForm
);

router.get(
  '/:id/view',
  checkPermission('permission'),
  permissionController.view
);

// Update permission
router.post(
  '/:id',
  checkPermission('edit-permission'),
  updatePermissionValidator,
  validatePermissionRequest,
  permissionController.update      
);

module.exports = router;