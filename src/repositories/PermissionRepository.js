const {Permission} = require('../models');
const { Op } = require('sequelize');

class PermissionRepository {

  async getPermission({
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

    return await Permission.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['id', 'DESC']
      ]
    });
  }

  async findById(id) {
    return await Permission.findByPk(id);
  }

  async create(data) {
    return await Permission.create(data);
  }

  async update(id, data) {
    const [affectedRows] = await Permission.update(data, {
      where: { id }
    });

    return affectedRows;
  }

  async delete(id) {
    return await Permission.destroy({
      where: { id }
    });
  }

  async findPermissionByName(name) {
    return await Permission.findOne({
      where: { name }
    });
  }

  async findAllPermissions() {
    return await Permission.findAll({
      order: [
        ['id', 'DESC']
      ]
    });
  }

}

module.exports = new PermissionRepository();