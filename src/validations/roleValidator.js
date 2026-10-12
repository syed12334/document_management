const { body, param } = require('express-validator');

const createRoleValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ max: 255 })
    .withMessage('Role name cannot exceed 255 characters')
    .matches(/^[a-zA-Z ]+$/)
    .withMessage('Role name can only contain letters, spaces')
];

const updateRoleValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid role ID'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ max: 255 })
    .withMessage('Role name cannot exceed 255 characters')
     .matches(/^[a-zA-Z ]+$/)
    .withMessage('Role name can only contain letters, spaces')
];

module.exports = {
  createRoleValidator,
  updateRoleValidator
};