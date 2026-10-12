const { Folder, User,AuditLog,FolderUser } = require('../models');
const { Op } = require('sequelize');

class FolderRepository {
  async startTransaction() {
    return await Folder.sequelize.transaction();
  }
  
    async getFolder({
  search = "",
  page = 1,
  limit = 10,
  userId = null
} = {}) {
  const offset = (page - 1) * limit;

  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Kept as a separate lookup so the include below still returns
  // ALL users of each folder, not just this one
  if (userId) {
    const rows = await FolderUser.findAll({
      attributes: ['folder_id'],
      where: { user_id: userId },
      raw: true
    });

    where.id = { [Op.in]: rows.map((r) => r.folder_id) };
  }

  return await Folder.findAndCountAll({
    where,

    include: [
      {
        model: Folder,
        as: 'parent',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',                 // creator
        attributes: ['id', 'username']
      },
      {
        model: FolderUser,
        as: 'folderuser',           // this folder's assigned users
        attributes: ['id', 'user_id'],
        required: false,            // LEFT JOIN: keep folders with no users
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }
        ]
      }
    ],

    distinct: true,                 // count folders, not joined rows
    limit,
    offset,

    order: [['id', 'DESC']]
  });
}
  async findById(id) {
    return await Folder.findByPk(id);
  }

  async findByIdWithChildren(id) {
    return await Folder.findByPk(id, {
      include: [
        {
          model: Folder,
          as: 'children'
        }
      ]
    });
  }

  async findByNameAndParent(name, parentId) {
    return await Folder.findOne({
      where: {
        name,
        parent_id: parentId
      }
    });
  }

  async create(data,transaction = null) {
    return await Folder.create(data,{transaction});
  }

  async update(id, data) {
    const [affectedRows] = await Folder.update(data, {
      where: { id }
    });

    return affectedRows;
  }

  async delete(id) {
    return await Folder.destroy({
      where: { id }
    });
  }

  async findFolderByName(fname) {
     return await Folder.findOne({
      where: {
        name: fname,
      }
});
  }

  async findAllFolders(){
    return await Folder.findAll({
       order: [
        ['id', 'DESC']
      ]
});
  }
   async createAuditLog(data) {
        return await AuditLog.create(data);
    }
    // Get all users
    async getAllUser() {
      return await User.findAll({
        where: {
          is_access:1
        },

       order:[
        ['username','asc']
       ]
      })
    }
    // Create folder users 
    async createFolderUsers(data,transaction = null) {
      return await FolderUser.create(data,{transaction});
    }
    // get Folder user by folder id
    async getFolderUserById(folder_id) {
      return await FolderUser.findAll({
        where:{
          folder_id:folder_id
        }
      });
    }

    async findExistingUserIds(ids) {
  if (!ids.length) return [];

  const rows = await User.findAll({
    attributes: ['id'],
    where: { id: { [Op.in]: ids } },
    raw: true
  });

  return rows.map((r) => Number(r.id));
}
async getFolderUserById(folder_id, transaction = null) {
  return await FolderUser.findAll({ where: { folder_id }, transaction });
}

async deleteFolderUsers(folder_id, userIds, transaction = null) {
  return await FolderUser.destroy({
    where: { folder_id, user_id: { [Op.in]: userIds } },
    transaction
  });
}

async bulkCreateFolderUsers(rows, transaction = null) {
  return await FolderUser.bulkCreate(rows, { transaction });
}
async getFolderById(id) {
  return await Folder.findByPk(id, {
    include: [
      {
        model: Folder,
        as: 'parent',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',                 // creator
        attributes: ['id', 'username']
      },
      {
        model: FolderUser,
        as: 'folderuser',           // assigned users
        attributes: ['id', 'user_id'],
        required: false,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }
        ]
      }
    ]
  });
}

}

module.exports = new FolderRepository();