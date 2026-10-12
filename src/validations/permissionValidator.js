const { body, param } = require('express-validator');

const createPermissionValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ max: 255 })
    .withMessage('Permission name cannot exceed 255 characters')
    .matches(/^[a-zA-Z- ]+$/)
    .withMessage('Permission name can only contain letters, spaces, hyphen'),


];

const updatePermissionValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid permission ID'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ max: 255 })
    .withMessage('Role name cannot exceed 255 characters')
     .matches(/^[a-zA-Z- ]+$/)
    .withMessage('Permission name can only contain letters, spaces, hyphen')
];

module.exports = {
  createPermissionValidator,
  updatePermissionValidator
};