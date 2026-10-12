const { validationResult } = require('express-validator');
const permissionService = require('../services/PermissionService');

class PermissionController {

  async index(req, res, next) {
    try {
      const {
        search = "",
        page = 1,
        limit = 10
      } = req.query;

      const data = await permissionService.getAllPermissions({
        search,
        page,
        limit
      });

      if (
        data.totalPages > 0 &&
        data.currentPage > data.totalPages
      ) {
        return res.redirect(
          `/permissions?page=${data.totalPages}` +
          `&limit=${data.limit}` +
          `&search=${data.search}`
        );
      }

      res.render("permissions/index", {
        title: "Permissions",
        ...data,
      });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async createForm(req, res, next) {
    try {
      const data = await permissionService.getAllPermissions({
        page: 1,
        limit: 10
      });

      res.render('permissions/add', {
        title: 'Add permission',
        permissions: data.permissions,
        errors: [],
        old: {},
      });

    } catch (error) {
      next(error);
    }
  }

async store(req, res, next) {
    try {
      // validationResult / field-validation errors are already handled by
      // the validatePermissionRequest middleware before this method runs,
      // so by this point req.body.name has passed basic validation.

      try {
        await permissionService.createPermission({
          name: req.body.name,
        });
      } catch (serviceError) {
        // Catches "A permission with this name already exists"
        // thrown by PermissionService.createPermission.
        const data = await permissionService.getAllPermissions({
          page: 1,
          limit: 10
        });

        return res.status(422).render('permissions/add', {
          title: 'Add Permission',
          permissions: data.permissions,
          errors: { name: serviceError.message },
          old: req.body
        });
      }

      req.session.success = 'Permission created successfully';

      res.redirect('/permissions');

    } catch (error) {
      next(error);
    }
  }

  async editForm(req, res, next) {
    try {
      const role = await permissionService.getPermissionById(req.params.id);

      const data = await permissionService.getAllPermissions({
        page: 1,
        limit: 100
      });

      res.render('permissions/edit', {
        title: 'Edit Permission',
        role,
        roles: data.permissions,
        errors: []
      });

    } catch (error) {
      next(error);
    }
  }

  async view(req, res, next) {
    try {
      const role = await permissionService.getPermissionById(req.params.id);

      res.render('permissions/view', {
        title: 'View Permission',
        role,
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const errors = validationResult(req);

      const permission = await permissionService.getPermissionById(req.params.id);

      const data = await permissionService.getAllPermissions({
        page: 1,
        limit: 100
      });

      if (!errors.isEmpty()) {
        const errorObj = {};
        errors.array().forEach(err => {
          errorObj[err.path] = err.msg;
        });

        return res.status(422).render('permissions/edit', {
          title: 'Edit Permission',
          permission: {
            ...permission.toJSON(),
            name: req.body.name,
          },
          permissions: data.permissions,
          errors: errorObj
        });
      }

      try {
        await permissionService.updatePermission(req.params.id, {
          name: req.body.name,
        });
      } catch (serviceError) {
        // Catches "A permission with this name already exists"
        // (and "Permission not found") thrown by PermissionService.
        return res.status(422).render('permissions/edit', {
          title: 'Edit Permission',
          permission: {
            ...permission.toJSON(),
            name: req.body.name,
          },
          permissions: data.permissions,
          errors: { name: serviceError.message }
        });
      }

      req.session.success = 'Permission updated successfully';

      res.redirect('/permissions');

    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await permissionService.deletePermission(req.params.id);

      req.session.success = 'Permission deleted successfully';

      res.redirect('/permissions');

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new PermissionController();