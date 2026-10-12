const rolePermissionRepository = require("../repositories/RolePermissionRepository");
const normalizeUserIds = (raw) => [
  ...new Set(
    [].concat(raw ?? [])
      .map(Number)
      .filter((n) => Number.isInteger(n) && n > 0)
  )
];
class RolePermissionService {
  async getAllRolePermissions({ search = "", page = 1, limit = 10 } = {}) {
    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) limit = 10;

    search = String(search).trim();

    const { count, rows } = await rolePermissionRepository.getRolePermission({
      search,
      page,
      limit,
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
      nextPage: page + 1,
    };
  }
  //get roles 
  async getRoles() {
    return  await rolePermissionRepository.getRoles();
  }
   //get roles 
  async getPermissions() {
    return  await rolePermissionRepository.getPermissions();
  }
 async createRolePermission(req, created_by) {
  const transaction = await rolePermissionRepository.startTransaction();

  try {
    const role_id = req.body.roles || null;

    // Array of permission IDs (renamed so it doesn't clash with the loop variable)
    let permissionIds = normalizeUserIds(
      req.body.permissions ?? req.body['permissions[]']
    );

    // Make sure it's always an array
    if (!Array.isArray(permissionIds)) {
      permissionIds = permissionIds ? [permissionIds] : [];
    }

    if (!role_id) {
      throw new Error('Role is required');
    }

    for (const permissionId of permissionIds) {
      const rolePermissionData = {
        role_id: role_id,
        permission_id: permissionId
      };

      await rolePermissionRepository.create(rolePermissionData, transaction);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('createRolePermission error:', error);
    throw error; // so the controller's next(error) sees it
  }
}

async deleteRolePermission(id) {
  return await rolePermissionRepository.delete(id);
}

  async getPermissionById(id) {
    const Permission = await rolePermissionRepository.findById(id);

    if (!Permission) {
      throw new Error('Permission not found');
    }

    return Permission;
  }
}

module.exports = new RolePermissionService();