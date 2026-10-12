const { User, Folder, Document, AuditLog,FolderUser } = require('../models');
const { Op } = require('sequelize');

const SIZE_UNITS = {
  b: 1,
  kb: 1024,
  mb: 1024 ** 2,
  gb: 1024 ** 3
  // use 1000, 1000 ** 2, 1000 ** 3 if you display sizes in decimal units
};

// "20 kb" | "1.5MB" | "2gb" -> { min, max } in bytes, or null if not a size query
function parseSizeQuery(search) {
  const match = search.trim().match(/^(\d+(?:\.(\d+))?)\s*(kb|mb|gb|b)$/i);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const decimals = match[2] ? match[2].length : 0;
  const unitBytes = SIZE_UNITS[match[3].toLowerCase()];

  // tolerance = half of the last typed digit (20 -> ±0.5, 1.5 -> ±0.05)
  const tolerance = 0.5 * 10 ** -decimals * unitBytes;
  const bytes = value * unitBytes;

  return { min: bytes - tolerance, max: bytes + tolerance };
}

// Escape LIKE wildcards so user input like "50%" or "a_b" is matched literally
function escapeLike(str) {
  return str.replace(/[\\%_]/g, '\\$&');
}

class DocumentRepository {
  async findAllDocument({ search = "", page = 1, limit = 10, userId = null } = {}) {
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    const term = escapeLike(search);

    const conditions = [
      { original_name: { [Op.iLike]: `%${term}%` } },
      { '$folder.name$': { [Op.iLike]: `%${term}%` } }
    ];

    const size = parseSizeQuery(search);
    if (size) {
      conditions.push({
        file_size: {
          [Op.gte]: size.min,
          [Op.lt]: size.max
        }
      });
    }

    where[Op.or] = conditions;
  }

  const folderInclude = {
    model: Folder,
    as: 'folder',
    attributes: ['id', 'name'],
    required: false
  };

  // Non-admin: only documents whose folder has a folder_users row for this user
  if (userId) {
    folderInclude.required = true; 
    folderInclude.include = [
      {
        model: FolderUser,
        as: 'folderuser',   
        attributes: [],    
        where: { user_id: userId },
        required: true
      }
    ];
  }

  return await Document.findAndCountAll({
    where,
    subQuery: false, 

    include: [
      folderInclude,
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email'],
        required: false
      }
    ],

    limit,
    offset,
    order: [['id', 'DESC']],
    distinct: true
  });
}

  async findById(id) {
    return await Document.findByPk(id, {
      include: [
        {
          model: Folder,
          as: 'folder',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user', // matches Document.belongsTo(User, { as: 'user' })
          attributes: ['id', 'username', 'email']
        }
      ]
    });
  }

  async findByFolderId(folderId) {
    return await Document.findAll({
      where: {
        folder_id: folderId
      },

      include: [
        {
          model: Folder,
          as: 'folder',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user', // was 'uploader'; changed to match the alias used above
          attributes: ['id', 'username', 'email'] // was 'name'; the User model uses 'username'
        }
      ],

      order: [['created_at', 'DESC']]
    });
  }

  async create(data) {
    return await Document.create(data);
  }

  async update(id, data) {
    const document = await Document.findByPk(id);

    if (!document) {
      return null;
    }

    await document.update(data);

    return document;
  }

  async delete(id) {
    const document = await Document.findByPk(id);

    if (!document) {
      return null;
    }

    await document.destroy();

    return document;
  }

  async findAllFolders() {
    return await Folder.findAll({
      order: [['id', 'DESC']]
    });
  }

  async createAuditLog(data) {
    return await AuditLog.create(data);
  }

}

module.exports = new DocumentRepository();