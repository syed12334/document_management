const folderRepository = require('../repositories/FolderRepository');
const normalizeUserIds = (raw) => [
  ...new Set(
    [].concat(raw ?? [])
      .map(Number)
      .filter((n) => Number.isInteger(n) && n > 0)
  )
];
class FolderService {



   async getAllFolders({
  search = "",
  page = 1,
  limit = 10,
  userId = null
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
    await folderRepository.getFolder({
      search,
      page,
      limit,
      userId
    });

  const totalPages = Math.ceil(count / limit);

  return {
    folders: rows,
    totalFolders: count,
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

  async getFolderById(id) {
    const folder = await folderRepository.getFolderById(id);

    if (!folder) {
      throw new Error('Folder not found');
    }

    return folder;
  }

  async createFolder(req,created_by) {
    const transaction = await folderRepository.startTransaction();
    try {
        const parentId = req.body.parent_id || null;
          const name = req.body.name || null;
              const userIds = normalizeUserIds(req.body.user_id ?? req.body['user_id[]']);


          if (parentId) {
            const parent = await folderRepository.findById(parentId);

            if (!parent) {
              throw new Error('Parent folder not found');
            }
          }

          const existingFolder =
            await folderRepository.findByNameAndParent(name, parentId);

          if (existingFolder) {
            throw new Error(
              'A folder with this name already exists in the selected parent'
            );
          }

          const folder =  await folderRepository.create({
            name,
            parent_id: parentId,
            created_by,
            is_permission : req.body.is_permission
          },transaction);

          if(userIds.length >0) {
            for (const userId of userIds) {
              const folderdata = {
                folder_id :folder.id,
                user_id :userId
              };
              await folderRepository.createFolderUsers(folderdata,transaction);
            }
          }
          await transaction.commit();
    }
     catch {
        await transaction.rollback();
        throw err;
     }
    


  }
  
  async updateFolder(id, { name, parent_id, user_ids = [], is_permission = false }) {
  const folder = await folderRepository.findById(id);
  if (!folder) throw new Error('Folder not found');

  const parentId = parent_id || null;

  if (parentId && Number(parentId) === Number(id)) {
    throw new Error('A folder cannot be its own parent');
  }

  if (parentId) {
    const parent = await folderRepository.findById(parentId);
    if (!parent) throw new Error('Parent folder not found');
    await this.checkCircularReference(id, parentId);
  }

  const existingFolder = await folderRepository.findByNameAndParent(name, parentId);
  if (existingFolder && Number(existingFolder.id) !== Number(id)) {
    throw new Error('A folder with this name already exists in the selected parent');
  }

  // Toggle off => nobody gets access
  const ids = is_permission
    ? [...new Set(user_ids.map(Number))].filter(Number.isInteger)
    : [];

  if (ids.length) {
    const found = await folderRepository.findExistingUserIds(ids);
    if (found.length !== ids.length) {
      throw new Error('One or more selected users do not exist');
    }
  }

  const t = await folderRepository.startTransaction();
  try {
    await folderRepository.update(id, { name, parent_id: parentId }, t);
    await this.syncFolderUsers(id, ids, t);
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }

  return await folderRepository.findById(id);
}

async syncFolderUsers(folderId, newIds, transaction) {
  const current = await folderRepository.getFolderUserById(folderId, transaction);
  const currentIds = current.map((r) => Number(r.user_id));

  const toAdd = newIds.filter((x) => !currentIds.includes(x));
  const toRemove = currentIds.filter((x) => !newIds.includes(x));

  if (toRemove.length) {
    await folderRepository.deleteFolderUsers(folderId, toRemove, transaction);
  }
  if (toAdd.length) {
    await folderRepository.bulkCreateFolderUsers(
      toAdd.map((user_id) => ({ folder_id: folderId, user_id })),
      transaction
    );
  }
}
  // async updateFolder(id, { name, parent_id }) {
  //   const folder = await folderRepository.findById(id);

  //   if (!folder) {
  //     throw new Error('Folder not found');
  //   }

  //   const parentId = parent_id || null;

  //   if (parentId && Number(parentId) === Number(id)) {
  //     throw new Error('A folder cannot be its own parent');
  //   }

  //   if (parentId) {
  //     const parent = await folderRepository.findById(parentId);

  //     if (!parent) {
  //       throw new Error('Parent folder not found');
  //     }

  //     await this.checkCircularReference(id, parentId);
  //   }

  //   const existingFolder =
  //     await folderRepository.findByNameAndParent(name, parentId);

  //   if (
  //     existingFolder &&
  //     Number(existingFolder.id) !== Number(id)
  //   ) {
  //     throw new Error(
  //       'A folder with this name already exists in the selected parent'
  //     );
  //   }

  //   await folderRepository.update(id, {
  //     name,
  //     parent_id: parentId
  //   });

  //   return await folderRepository.findById(id);
  // }

  async checkCircularReference(folderId, parentId) {
    let currentParentId = parentId;

    while (currentParentId) {
      if (Number(currentParentId) === Number(folderId)) {
        throw new Error(
          'Cannot move a folder inside its own descendant'
        );
      }

      const parent = await folderRepository.findById(currentParentId);

      if (!parent) {
        break;
      }

      currentParentId = parent.parent_id;
    }
  }

  async deleteFolder(id) {
    const folder = await folderRepository.findByIdWithChildren(id);



    return await folderRepository.delete(id);
  }

  async getFolderByName(name) {
      return await folderRepository.findFolderByName(name);
}

 // Create document logs
  async createFolderLog(data) {
    return await folderRepository.createAuditLog(data);
  }
//Get all users 
async getUsers() {
  return await folderRepository.getAllUser();
}

// get folderuser by folder id 
async getFolderUserById(folder_id) {
  return await folderRepository.getFolderUserById(folder_id);
}
}

module.exports = new FolderService();