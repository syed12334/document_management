const express = require('express');
const { validationResult } = require('express-validator');

const router = express.Router();

const rolePermissionController = require('../controllers/RolePermissionController');
const auth = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permissions.middleware');
const { createRolePermissionValidator,
  updateRolePermissionValidator } = require('../validations/rolePermissionValidator');

// Lists methods on the object AND its prototype chain (works for class instances)
function listMethods(obj) {
  const names = new Set();
  let current = obj;
  while (current && current !== Object.prototype) {
    Object.getOwnPropertyNames(current).forEach((n) => {
      if (n !== 'constructor') names.add(n);
    });
    current = Object.getPrototypeOf(current);
  }
  return [...names];
}

// Fails at startup with a clear message naming the missing method
function handler(name) {
  const fn = rolePermissionController[name];
  if (typeof fn !== 'function') {
    throw new Error(
      `RolePermissionController.${name} is not a function. ` +
      `Available methods: [${listMethods(rolePermissionController).join(', ')}]`
    );
  }
  return fn.bind(rolePermissionController);
}

// Stops the request if express-validator found errors
function validateRolePermissionRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.error = errors.array().map((e) => e.msg).join(', ');
    return res.redirect(req.get('Referer') || '/role-permission');
  }

  next();
}

router.use(auth);

router.get('/', handler('index'));

router.get('/create',  handler('create'));
router.post('/saveRole',createRolePermissionValidator,  handler('store'));

// router.post(
//   '/store',
//   checkPermission('add-permission'),
//   rolePermissionValidator,
//   validateRolePermissionRequest,
//   handler('store')
// );

router.get('/delete/:id', checkPermission('delete-permission'), handler('destroy'));

// router.get('/:id/edit', checkPermission('edit-permission'), handler('editForm'));

// router.get('/:id/view', checkPermission('view-permission'), handler('view'));

// router.post(
//   '/:id',
//   checkPermission('edit-permission'),
//   rolePermissionValidator,
//   validateRolePermissionRequest,
//   handler('update')
// );

module.exports = router;