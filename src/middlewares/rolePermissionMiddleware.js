const { validationResult } = require('express-validator');
const rolePermission = require('../services/RolePermissionService');

function validateRolePermissionRequest(mode = 'add') {
  return async function (req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const errors = {};
    result.array().forEach(error => {
      // keep the first error per field (user_id.0 etc. are grouped under user_id)
      const key = error.path.startsWith('user_id') ? 'user_id' : error.path;
      if (!errors[key]) errors[key] = error.msg;
    });

    try {
      const isEdit = mode === 'edit';
      const users = await rolePermission.getUsers();
      const viewData = {
        title: isEdit ? 'Edit Role Permission' : 'Add role & permissions',
        errors,
        // keep the id so the edit form's action URL still works
        old: isEdit ? { ...req.body, id: req.params.id } : req.body,
        users
      };

      if (isEdit) {
        // adjust to whatever your service method is called
        viewData.folder = await rolePermission.getFolderById(req.params.id);
      } else {
        const data = await rolePermission.getAllFolders({ page: 1, limit: 10 });
        viewData.folders = data.folders;
      }

      return res.status(422).render(isEdit ? 'folders/edit' : 'folders/add', viewData);
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { validateRolePermissionRequest };