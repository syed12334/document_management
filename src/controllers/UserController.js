const { validationResult } = require('express-validator');
const userService = require('../services/UserService');

// Turns express-validator errors into { fieldName: message }
function formatErrors(errors) {
  const errorObj = {};
  errors.array().forEach(err => {
    if (!errorObj[err.path]) {
      errorObj[err.path] = err.msg;
    }
  });
  return errorObj;
}

// Never send the password back to the form
function withoutPassword(body) {
  const { password, ...rest } = body;
  return rest;
}

class UserController {

  async index(req, res, next) {
    try {
      const {
        search = "",
        page = 1,
        limit = 10
      } = req.query;

      const data = await userService.getAllUsers({
        search,
        page,
        limit
      });

      if (
        data.totalPages > 0 &&
        data.currentPage > data.totalPages
      ) {
        return res.redirect(
          `/users?page=${data.totalPages}` +
          `&limit=${data.limit}` +
          `&search=${encodeURIComponent(data.search)}`
        );
      }

      res.render("users/index", {
        title: "Users",
        ...data,
      });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async createForm(req, res, next) {
    try {
      const roles = await userService.getRoles();

      res.render('users/add', {
        title: 'Add User',
        roles,
        errors: {},
        old: {},
      });

    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const { username, email, password, role_id } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const roles = await userService.getRoles();

        return res.status(422).render('users/add', {
          title: 'Add User',
          roles,
          errors: formatErrors(errors),
          old: withoutPassword(req.body)
        });
      }

      // 2. Business-rule errors thrown by the service (e.g. duplicate email)
      try {
        await userService.createUser({
          username,
          email,
          password,
          role_id
        });
      } catch (serviceError) {
        const roles = await userService.getRoles();

        return res.status(422).render('users/add', {
          title: 'Add User',
          roles,
          errors: { [serviceError.field || 'general']: serviceError.message },
          old: withoutPassword(req.body)
        });
      }

      req.session.success = 'User created successfully';

      res.redirect('/users');

    } catch (error) {
      next(error);
    }
  }

  async editForm(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      const roles = await userService.getRoles();

      const userData = user.toJSON();
      delete userData.password;

      res.render('users/edit', {
        title: 'Edit User',
        user: userData,
        roles,
        errors: {}
      });

    } catch (error) {
      next(error);
    }
  }

  async view(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      const userData = user.toJSON();
      delete userData.password;

      res.render('users/view', {
        title: 'View User',
        user: userData,
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { username, email, password, role_id } = req.body;
      const errors = validationResult(req);

      const user = await userService.getUserById(req.params.id);
      const roles = await userService.getRoles();

      // Existing user data overlaid with what the person just typed,
      // so the form keeps their input when it re-renders with errors.
      const userData = user.toJSON();
      delete userData.password;
      const formUser = { ...userData, username, email, role_id };

      // 1. Field validation errors
      if (!errors.isEmpty()) {
        return res.status(422).render('users/edit', {
          title: 'Edit User',
          user: formUser,
          roles,
          errors: formatErrors(errors)
        });
      }

      await userService.updateUser(req.params.id, {
          username,
          email,
          password,
          role_id
        });

      req.session.success = 'User updated successfully';

      res.redirect('/users');

    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    req.session.success = 'User deleted successfully';
  } catch (error) {
    console.error('Delete user failed:', error); // full details stay in the server log

    // 404/409 have friendly messages from the service; anything else gets a generic one
    req.session.error = error.status
      ? error.message
      : 'Something went wrong while deleting the user.';
  }

  return res.redirect('/users');
}

}

module.exports = new UserController();