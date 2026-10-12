
const {sequelize,User,Role, Permission, UserLoginHistory,Folder,FolderUser ,AuditLog } = require("../models");
const { Op } = require('sequelize');

class UserRepository {
async getUser({
    search = "",
    page = 1,
    limit = 10
  }) {
    const offset = (page - 1) * limit;

    const where = { is_access: 1 };

    if (search) {
    
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { "$role.name$": { [Op.iLike]: `%${search}%` } }
      ];
    }

    return await User.findAndCountAll({
      where,
      include: [
        {
          model: Role,
          as: "role"
        }
      ],
      limit,
      offset,
      order: [
        ['id', 'DESC']
      ],
      distinct: true,   // keeps `count` accurate when a join is involved
      subQuery: false   // lets "$role.name$" work together with limit/offset
    });
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, data) {
    const [affectedRows] = await User.update(data, {
      where: { id }
    });

    return affectedRows;
  }

  async delete(id) {
    return await sequelize.transaction(async (t) => {
      await AuditLog.destroy({ where: { user_id: id }, transaction: t });
      await FolderUser.destroy({ where: { user_id: id }, transaction: t });

      // returns the number of deleted rows
      return await User.unscoped().destroy({ where: { id }, transaction: t });
    });
  }

  async findUserByName(name) {
    return await User.findOne({
      where: { name }
    });
  }



  async getRole(name) {
    return await Role.findAll({
        order: [
        ['name', 'ASC']
      ]
    });
  }

  async findAllUsers() {
    return await User.findAll({
      order: [
        ['id', 'DESC']
      ]
    });
  }
    async findByEmail(email) { return await User.findOne({ where: { email }, include: [ { model: Role, as: 'role', include: [ { model: Permission, as: 'permissions', through: { attributes: [] } } ] } ] }); }
    // get login history
    async getUserLoginHistory(userId) {
         return await User.findByPk(userId, {
                include: [
                    {
                        model: User,
                        as: "user"
                    }
                ]
            });
    }
    // User login history creation
    async userCreateLoginHistory(data) {
        return await UserLoginHistory.create(data);
    }

    async findUserByEmail(email) {
       return await User.findOne({
      where: { email:email }
    });
    }
    
}

module.exports = new UserRepository();