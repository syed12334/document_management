const { User,Folder,Document,Role,FolderUser } = require("../models");


class DashboardRepository {
    // User count
   async getAllUserCount() {
        return await User.count({
            where: {
                is_access: 1
            }
        });
    }
      // Folder count
   async getAllFolderCount() {
        return await Folder.count();
    }
       // Document count
   async getAllDocumentCount() {
        return await Document.count();
    }
       // Role count
   async getAllRoleCount() {
        return await Role.count();
    }

    
  async findAllDocumentCount(userId = null) {
  const folderInclude = {
    model: Folder,
    as: 'folder',
    attributes: [],
    required: false
  };

  if (userId) {
    folderInclude.required = true;

    folderInclude.include = [
      {
        model: FolderUser,
        as: 'folderuser',
        attributes: [],
        where: {
          user_id: userId
        },
        required: true
      }
    ];
  }

  return await Document.count({
    include: [
      folderInclude
    ],
    distinct: true,
    col: 'id'
  });
}

async getFolderCount(userId = null) {
  const include = [];

  if (userId) {
    include.push({
      model: FolderUser,
      as: 'folderuser',
      attributes: [],
      where: {
        user_id: userId
      },
      required: true
    });
  }

  return await Folder.count({
    include,
  });
}


}

module.exports = new DashboardRepository();