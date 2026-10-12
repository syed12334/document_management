const { validationResult } = require('express-validator');
const roleService = require('../services/RoleService');
const { getRequestInfo } = require("../helpers/requestInfo");

class RoleController {

  async index(req, res, next) {
    try {
      const {
        search = "",
        page = 1,
        limit = 10
      } = req.query;

      const data = await roleService.getAllRoles({
        search,
        page,
        limit
      });

      if (
        data.totalPages > 0 &&
        data.currentPage > data.totalPages
      ) {
        return res.redirect(
          `/roles?page=${data.totalPages}` +
          `&limit=${data.limit}` +
          `&search=${data.search}`
        );
      }

      res.render("roles/index", {
        title: "Roles",
        ...data,
      });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async createForm(req, res, next) {
    try {
      const data = await roleService.getAllRoles({
        page: 1,
        limit: 10
      });

      res.render('roles/add', {
        title: 'Add Role',
        roles: data.roles,
        errors: [],
        old: {},
      });

    } catch (error) {
      next(error);
    }
  }

async store(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const data = await roleService.getAllRoles({
          page: 1,
          limit: 10
        });

        return res.status(422).render('roles/add', {
          title: 'Add Roles',
          roles: data.roles,
          errors: errors.array(),
          old: req.body
        });
      }

      const existingRole = await roleService.getRoleByName(req.body.name);

      if (existingRole) {
        const data = await roleService.getAllRoles({
          page: 1,
          limit: 10
        });

        return res.status(422).render('roles/add', {
          title: 'Add Roles',
          roles: data.roles,
          errors: [{ param: 'name', msg: 'Role name already exists, try another.' }],
          old: req.body
        });
      }

      await roleService.createRole({
        name: req.body.name,
      });

      req.session.success = 'Role created successfully';

      res.redirect('/roles');

    } catch (error) {
      next(error);
    }
  }

  async editForm(req, res, next) {
    try {
      const role = await roleService.getRoleById(req.params.id);

      const data = await roleService.getAllRoles({
        page: 1,
        limit: 100
      });

      res.render('roles/edit', {
        title: 'Edit Roles',
        role,
        roles: data.roles,
        errors: []
      });

    } catch (error) {
      next(error);
    }
  }

  async view(req, res, next) {
    try {
      const role = await roleService.getRoleById(req.params.id);

      res.render('roles/view', {
        title: 'View Role',
        role,
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const errors = validationResult(req);

      const role = await roleService.getRoleById(req.params.id);

      const data = await roleService.getAllRoles({
        page: 1,
        limit: 100
      });

      if (!errors.isEmpty()) {
        return res.status(422).render('roles/edit', {
          title: 'Edit Roles',
          role: {
            ...role.toJSON(),
            name: req.body.name,
          },
          roles: data.roles,
          errors: errors.array()
        });
      }

      try {
        await roleService.updateRole(req.params.id, {
          name: req.body.name,
        });
      } catch (serviceError) {
        // Catches "A role with this name already exists" (and "Role not found")
        // thrown by RoleService, and re-renders the edit form instead of
        // falling through to the generic error handler.
        return res.status(422).render('roles/edit', {
          title: 'Edit Roles',
          role: {
            ...role.toJSON(),
            name: req.body.name,
          },
          roles: data.roles,
          errors: [{ param: 'name', msg: serviceError.message }]
        });
      }

      req.session.success = 'Role updated successfully';

      res.redirect('/roles');

    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await roleService.deleteRole(req.params.id);

      req.session.success = 'Role deleted successfully';

      res.redirect('/roles');

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new RoleController();