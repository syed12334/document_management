const { validationResult } = require('express-validator');
const folderService = require('../services/FolderService');
const { getRequestInfo } = require("../helpers/requestInfo");
class FolderController {

  async index(req, res, next) {
    const sessionUser = req.session.user;
    const userId =
      sessionUser && Number(sessionUser.id) !== 1
        ? Number(sessionUser.id)
        : null;
    try {
      const {
        search = "",
        page = 1,
        limit = 10
      } = req.query;

      const data = await folderService.getAllFolders({
        search,
        page,
        limit,
        userId
      });
      
     

      if (
        data.totalPages > 0 &&
        data.currentPage > data.totalPages
      ) {
        return res.redirect(
          `/folders?page=${data.totalPages}` +
          `&limit=${data.limit}` +
          `&search=${data.search}`
        );
      }

     res.render("folders/index", {
        title: "Folders",
        ...data,
       
      });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async createForm(req, res, next) {
    try {
      const data = await folderService.getAllFolders({
        page: 1,
        limit: 10
      });
      const users = await folderService.getUsers();

      res.render('folders/add', {
        title: 'Add Folder',
        folders: data.folders,
        users,
        errors: [],
        old: {},
      });

    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {

         const errors = validationResult(req);
         const users = await folderService.getUsers();
        const existingFolder = await folderService.getFolderByName( req.body.name );
      if (!errors.isEmpty()) {
        const data = await folderService.getAllFolders({
        page: 1,
        limit: 10
      });

        return res.status(422).render('folders/add', {
          title: 'Add Folder',
          folders: data.folders,  
          errors: errors.array(),
          old: req.body,
          users
        });
      }

      if (existingFolder) {

  const data = await folderService.getAllFolders({
    page: 1,
    limit: 10
  });
 const users = await folderService.getUsers();
  return res.status(422).render('folders/add', {
    title: 'Add Folder',
    folders: data.folders,
    users,
    errors: {
      name: 'Folder name already exists try another.'
    },
    old: req.body
  });
}
 

      await folderService.createFolder(req,req.session.user.id);

      req.session.success = 'Folder created successfully';

      res.redirect('/folders');

    } catch (error) {
      next(error);
    }
  }

    async editForm(req, res, next) {
      try {
        const folder = await folderService.getFolderById(req.params.id);
        const users = await folderService.getUsers();
        const folderusers = await folderService.getFolderUserById(req.params.id);
        const data = await folderService.getAllFolders({
          page: 1,
          limit: 100
        });

        res.render('folders/edit', {
          title: 'Edit Folder',
          folder,
          users,
          folderusers,
          folders: data.folders,
          errors: []
        });

      } catch (error) {
        next(error);
      }
    }

 async update(req, res, next) {
  try {
    const errors = validationResult(req);
    const folder = await folderService.getFolderById(req.params.id);

    // "user_id[]" arrives as undefined, a string, or an array depending on selection
    const userIds = [].concat(req.body.user_id || []).map(String).filter(Boolean);
    const isPermission = req.body.is_permission === '1'; // unchecked box isn't sent

    if (!errors.isEmpty()) {
      const data = await folderService.getAllFolders({ page: 1, limit: 100 });
      const allUsers = await folderService.getAllUsers(); // whatever your edit GET uses

      return res.status(422).render('folders/edit', {
        title: 'Edit Folder',
        folder: {
          ...folder.toJSON(),
          name: req.body.name,
          parent_id: req.body.parent_id || null
        },
        allFolders: data.folders,
        allUsers,
        selectedUserIds: userIds,
        isPermission,
        errs: errors.mapped() // { name: {msg}, ... }
      });
    }

    await folderService.updateFolder(req.params.id, {
      name: req.body.name,
      parent_id: req.body.parent_id || null,
      user_ids: userIds,
      is_permission: isPermission
    });

    req.session.success = 'Folder updated successfully';
    res.redirect('/folders');
  } catch (error) {
    next(error);
  }
}


  async destroy(req, res, next) {
    try {
      console.log(req.params);
      await folderService.deleteFolder(req.params.id);

      req.session.success = 'Folder deleted successfully';

      res.redirect('/folders');

    } catch (error) {
      next(error);
    }
  }

  async view(req,res, next) {
    try {
      const requestInfo = getRequestInfo(req);
      if (req.session.user.is_access ==1) {
        const folderLogs = {
                  user_id: req.session.user.id,
                  document_id:null,
                  folder_id:req.params.id,
                  action:"folder viewed",
                  file_name :null,
                  file_path:null,
                  ip_address: requestInfo.ipAddress,
                  user_agent: requestInfo.userAgent
              };
                  await folderService.createFolderLog(folderLogs);
      }
       
        const folder = await folderService.getFolderById(req.params.id);

      const data = await folderService.getAllFolders({
        page: 1,
        limit: 100
      });

      res.render('folders/view', {
        title: 'View Folder',
        folder,
        folders: data.folders,
        errors: []
      });
    }
    catch(error) {
      next(error);
    }
  }
}

module.exports = new FolderController();