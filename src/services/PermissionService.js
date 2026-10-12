const permissionRepository = require('../repositories/PermissionRepository');

class PermissionService {

  async getAllPermissions({
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
      await permissionRepository.getPermission({
        search,
        page,
        limit
      });

    const totalPages = Math.ceil(count / limit);

    return {
      permissions: rows,
      totalPermissions: count,
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

  async getPermissionById(id) {
    const Permission = await permissionRepository.findById(id);

    if (!Permission) {
      throw new Error('Permission not found');
    }

    return Permission;
  }

  async createPermission({ name }) {
    const existingPermission = await permissionRepository.findPermissionByName(name);

    if (existingPermission) {
      throw new Error('A permission with this name already exists');
    }

    return await permissionRepository.create({
      name
    });
  }

  async updatePermission(id, { name }) {
    const Permission = await permissionRepository.findById(id);

    if (!Permission) {
      throw new Error('Permission not found');
    }

    const existingPermission = await permissionRepository.findPermissionByName(name);

    if (existingPermission && existingPermission.id !== Permission.id) {
      throw new Error('A permission with this name already exists');
    }

    await permissionRepository.update(id, {
      name
    });

    return await permissionRepository.findById(id);
  }

  async deletePermission(id) {
    return await permissionRepository.delete(id);
  }

  async getPermissionByName(name) {
    return await permissionRepository.findPermissionByName(name);
  }

}

module.exports = new PermissionService();