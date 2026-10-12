const roleRepository = require('../repositories/RoleRepository');

class RoleService {

  async getAllRoles({
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
      await roleRepository.getRole({
        search,
        page,
        limit
      });

    const totalPages = Math.ceil(count / limit);

    return {
      roles: rows,
      totalRoles: count,
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

  async getRoleById(id) {
    const role = await roleRepository.findById(id);

    if (!role) {
      throw new Error('Role not found');
    }

    return role;
  }

  async createRole({ name }) {
    const existingRole = await roleRepository.findRoleByName(name);

    if (existingRole) {
      throw new Error('A role with this name already exists');
    }

    return await roleRepository.create({
      name
    });
  }

  async updateRole(id, { name }) {
    const role = await roleRepository.findById(id);

    if (!role) {
      throw new Error('Role not found');
    }

    const existingRole = await roleRepository.findRoleByName(name);

    if (existingRole && existingRole.id !== role.id) {
      throw new Error('A role with this name already exists');
    }

    await roleRepository.update(id, {
      name
    });

    return await roleRepository.findById(id);
  }

  async deleteRole(id) {
    return await roleRepository.delete(id);
  }

  async getRoleByName(name) {
    return await roleRepository.findRoleByName(name);
  }

}

module.exports = new RoleService();