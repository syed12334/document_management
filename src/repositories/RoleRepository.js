const {Role} = require('../models');
const { Op } = require('sequelize');

class RoleRepository {

  async getRole({
    search = "",
    page = 1,
    limit = 10
  }) {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search}%`
          }
        }
      ];
    }

    return await Role.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['id', 'DESC']
      ]
    });
  }

  async findById(id) {
    return await Role.findByPk(id);
  }

  async create(data) {
    return await Role.create(data);
  }

  async update(id, data) {
    const [affectedRows] = await Role.update(data, {
      where: { id }
    });

    return affectedRows;
  }

  async delete(id) {
    return await Role.destroy({
      where: { id }
    });
  }

  async findRoleByName(name) {
    return await Role.findOne({
      where: { name }
    });
  }

  async findAllRoles() {
    return await Role.findAll({
      order: [
        ['id', 'DESC']
      ]
    });
  }

}

module.exports = new RoleRepository();