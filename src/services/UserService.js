const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/UserRepository');
const { ForeignKeyConstraintError } = require('sequelize');

const SALT_ROUNDS = 10;


function fieldError(message, field) {
  const err = new Error(message);
  err.field = field;
  return err;
}

class UserService {

  async getAllUsers({
    search = "",
    page = 1,
    limit = 10
  } = {}) {
    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      limit = 10;
    }

    search = String(search).trim();

    const { count, rows } =
      await userRepository.getUser({
        search,
        page,
        limit
      });

    const totalPages = Math.ceil(count / limit);

    return {
      users: rows,
      totalUsers: count,
      currentPage: page,
      limit,
      totalPages,
      search,

      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,

      previousPage: page - 1,
      nextPage: page + 1
    };
  }

    async getUserById(id) {
      const user = await userRepository.findById(id);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    }

  // Roles for the role_id dropdown on the add/edit forms
  async getRoles() {
    return await userRepository.getRole();
  }

   async createUser({ username, email, password, role_id }) {
    email = String(email).trim().toLowerCase();
 
    const existingUser = await userRepository.findUserByEmail(email);
 
    if (existingUser) {
      throw fieldError('A user with this email already exists', 'email');
    }
 
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
 
    return await userRepository.create({
      username,
      email,
      password: hashedPassword,
      role_id,
      status:0,
      is_access: 1
    });
  }

  async updateUser(id, { username, email, password, role_id }) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    email = String(email).trim().toLowerCase();

    const existingUser = await userRepository.findUserByEmail(email);

    // if (existingUser && existingUser.id !== user.id) {
    //   throw fieldError('A user with this email already exists', 'email');
    // }

    const data = { username, email, role_id };

    // Only change the password if a new one was entered
    if (password) {
      data.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    await userRepository.update(id, data);

    return await userRepository.findById(id);
  }

async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw httpError('User not found.', 404);
    }

    let deletedCount;
    try {
      deletedCount = await userRepository.delete(id);
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw httpError('User cannot be deleted because other records depend on it.', 409);
      }
      throw err;
    }

    if (!deletedCount) {
      // row existed a moment ago but nothing was deleted (race condition)
      throw httpError('User could not be deleted.', 409);
    }

    return deletedCount;
  }

  async getUserByEmail(email) {
    return await userRepository.findUserByEmail(
      String(email).trim().toLowerCase()
    );
  }

}

module.exports = new UserService();