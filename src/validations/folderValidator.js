const { body, param } = require('express-validator');

const userIdsValidator = [
  body('user_id')
    .isArray({ min: 1 })
    .withMessage('Please select at least one user'),

  body('user_id.*')
    .isInt({ min: 1 })
    .withMessage('Invalid user ID')
];

const folderNameValidator = body('name')
  .trim()
  .notEmpty()
  .withMessage('Folder name is required')
  .isLength({ max: 255 })
  .withMessage('Folder name cannot exceed 255 characters')
  .matches(/^[a-zA-Z_\- ]+$/)
  .withMessage('Folder name can only contain letters, hyphens, underscores and spaces');

const parentIdValidator = body('parent_id')
  .optional({ values: 'falsy' })
  .isInt({ min: 1 })
  .withMessage('Invalid parent folder');

  const is_permission =  body('is_permission')
    .isInt({ min: 1 })
    .withMessage('Please select permission')

const createFolderValidator = [
  folderNameValidator,
  parentIdValidator,
  ...userIdsValidator,
  is_permission
];

const updateFolderValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid folder ID'),
  folderNameValidator,
  parentIdValidator,
  ...userIdsValidator,
  is_permission
];

module.exports = {
  createFolderValidator,
  updateFolderValidator
};