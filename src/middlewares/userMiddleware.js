const { validationResult } = require('express-validator');
const userService = require('../services/UserService');
function validateUserRequest(mode = 'add') {
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
       const roles = await userService.getRoles();
      const viewData = {
        title: isEdit ? 'Edit role' : 'Add role',
        errors,
        // keep the id so the edit form's action URL still works
        old: isEdit ? { ...req.body, id: req.params.id } : req.body,
        roles
      };

      if (isEdit) {
            viewData.user = await userService.getUserById(req.params.id);
               viewData.roles = await userService.getRoles();
      } else {
          const roles = await userService.getRoles();
        viewData.roles = roles;
      }

      return res.status(422).render(isEdit ? 'users/edit' : 'users/add', viewData);
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { validateUserRequest };