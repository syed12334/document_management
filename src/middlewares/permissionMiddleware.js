const { validationResult } = require('express-validator');
const permissionService = require('../services/PermissionService');

async function validatePermissionRequest(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = {};
    result.array().forEach(error => {
      errors[error.path] = error.msg;
    });

    try {
      const data = await permissionService.getAllPermissions({ page: 1, limit: 10 });

      return res.status(422).render('permissions/add', {
        title: 'Add Permission',
        errors,
        old: req.body,
        permissions: data.permissions 
      });
    } catch (err) {
      return next(err);
    }
  }

  next();
}

module.exports = {
  validatePermissionRequest
};