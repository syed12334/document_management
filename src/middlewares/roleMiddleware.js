const { validationResult } = require('express-validator');
const roleService = require('../services/RoleService');
function validateRoleRequest(mode = 'add') {
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
       const data = await roleService.getAllRoles({ search:"",page: 1, limit: 10 });
      const viewData = {
        title: isEdit ? 'Edit role' : 'Add role',
        errors,
        // keep the id so the edit form's action URL still works
        old: isEdit ? { ...req.body, id: req.params.id } : req.body,
        roles:data.roles
      };

      if (isEdit) {

                viewData.role = await roleService.getRoleById(req.params.id);
               
                 const data = await roleService.getAllRoles({
                  search:"",
                       page: 1,
                       limit: 100
                     });
                     viewData.roles = data.roles;
      } else {
       const data = await roleService.getAllRoles({ search:"",page: 1, limit: 10 });
        viewData.roles = data.roles;
      }

      return res.status(422).render(isEdit ? 'roles/edit' : 'roles/add', viewData);
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { validateRoleRequest };