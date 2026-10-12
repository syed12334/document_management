const { body, param } = require('express-validator');

const PermissionValidator = [
  body('permissions')
    .isArray({ min: 1 })
    .withMessage('Please select at least one permission'),

  body('permissions.*')
    .isInt({ min: 1 })
    .withMessage('Invalid permission ID')
];

const roleId = body('roles')
  .trim()
  .notEmpty()
  .withMessage('Please select roles');

const parentIdValidator = body('parent_id')
  .optional({ values: 'falsy' })
  .isInt({ min: 1 })
  .withMessage('Invalid parent folder');



const createRolePermissionValidator = [
  roleId,
  ...PermissionValidator,
];

const updateRolePermissionValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid role permission ID'),
  roleId,
  ...PermissionValidator,
];

module.exports = {
  createRolePermissionValidator,
  updateRolePermissionValidator
};