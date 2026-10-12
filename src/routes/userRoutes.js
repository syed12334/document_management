const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');
const auth = require('../middlewares/auth.middleware');
const { validateUserRequest } = require("../middlewares/userMiddleware");
const {
    checkPermission
} = require("../middlewares/permissions.middleware");
const {
    createUserValidator,updateUserValidator
} = require("../validations/userValidator"); 
router.use(auth);

router.get('/', checkPermission('view-user'), userController.index);
router.get('/create', checkPermission('add-user'), userController.createForm);

router.post(
  '/store',
  checkPermission('add-user'),
      createUserValidator,
  validateUserRequest('add'),     
  userController.store
);

// Delete user
router.get(
  '/delete/:id',
  checkPermission('delete-user'),
  userController.destroy
);

router.get(
  '/:id/edit',
  checkPermission('edit-user'),
  userController.editForm
);


// Update user
router.post(
  '/:id/update',
  checkPermission('edit-user'),
  updateUserValidator,
  validateUserRequest('edit'),
  userController.update      
);

module.exports = router;