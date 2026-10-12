const rolePermission = require('../services/RolePermissionService');
const { encryptData } = require("../helpers/encryptordecrypt");
const { validationResult } = require('express-validator');
const logger = require('../config/logger');
class RolePermissionController {
  // Fetch all role permissions
  async index(req, res, next) {
    try {
      const { search = "", page = 1, limit = 10 } = req.query;

      const data = await rolePermission.getAllRolePermissions({
        search,
        page,
        limit,
      });


      // If the requested page is beyond the last page, redirect to the last one
      if (data.totalPermissions > 0 && data.currentPage > data.totalPermissions) {
        return res.redirect(
          `/role/permission?page=${data.totalPermissions}` +
            `&limit=${data.limit}` +
            `&search=${encodeURIComponent(data.search)}`
        );
      }

      return res.render("role_permissions/index", {
        title: "Role Permissions",
        ...data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async create(req,res) {
    const roles = await rolePermission.getRoles();
    const permissions = await rolePermission.getPermissions();
    return res.render("role_permissions/add", {
  title: "Role Permissions add",
  roles,
  permissions,
  errors: {}
}, (err, html) => {
  if (err) {
    console.error(err.message); // includes file path, line number and the bad code
    return res.status(500).send(err.message);
  }
  res.send(html);
});
  }
  // Store role permission
async store(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const data = await rolePermission.getAllRolePermissions({
        search: "",
        page: 1,
        limit: 10
      });

      // If your view needs users, load them here, e.g.:
      // const users = await folderService.getUsers();

      return res.status(422).render('role_permission/add', {
        title: 'Add Role & Permission',
        folders: data.permissions,
        errors: errors.array(),
        old: req.body
        // users
      });
    }

    await rolePermission.createRolePermission(req, req.session.user.id);

    req.session.success = 'Permission created successfully';
    return res.redirect('/role/permission');
  } catch (error) {
    next(error);
  }
}

// async editForm(req, res, next) {
//     try {
//        const roles = await rolePermission.getRoles();
//       const permissions = await rolePermission. ();
//       const role = await rolePermission.getPermissionById(req.params.id);

//       const data = await rolePermission.getAllPermissions({
//         page: 1,
//         limit: 100
//       });

//       res.render('role_permission/edit', {
//         title: 'Edit Permission',
//         role,
//         roles: data.permissions,
//         errors: []
//       });

//     } catch (error) {
//       next(error);
//     }
//   }


 async destroy(req, res, next) {
    try {
      console.log(req.params);
      await rolePermission.deleteRolePermission(req.params.id);

      req.session.success = 'Permission deleted successfully';

      res.redirect('/role/permission');

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RolePermissionController();