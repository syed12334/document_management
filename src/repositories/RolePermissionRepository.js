const { Op } = require("sequelize");
const db = require("../models");

const Role_permission = db.Role_permission;
const Role = db.Role;
const Permission = db.Permission;

if (!Role_permission || !Role || !Permission) {
  throw new Error(
    "Model import failed in RolePermissionRepository. Available models: " +
      Object.keys(db).join(", ")
  );
}

class RolePermissionRepository {
   async startTransaction() {
    return await Role_permission.sequelize.transaction();
  }
  async getRolePermission({ search = "", page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        { "$role.name$": { [Op.iLike]: `%${search}%` } },
        { "$permission.name$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    return await Role_permission.findAndCountAll({
      where,
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: Permission,
          as: "permission",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      limit,
      offset,
      order: [["id", "DESC"]],
      subQuery: false, 
      distinct: true, 
    });
  }
 // Get all roles
  async getRoles() {
    return await Role.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
  }

  // Get all permissions
  async getPermissions() {
    return await Permission.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
  }
  //create permisisons
  async create(data) {
    return await Role_permission.create(data);
  }
   async delete(id) {
    return await Role_permission.destroy({
      where: { id }
    });
  }

    async findById(id) {
    return await Role_permission.findByPk(id);
  }
}

module.exports = new RolePermissionRepository();