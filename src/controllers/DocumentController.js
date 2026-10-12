const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const util = require('util');
const execFileAsync = util.promisify(execFile);
const { getRequestInfo } = require("../helpers/requestInfo");
const documentService =
    require('../services/DocumentService');

const {
    validationResult
} = require('express-validator');

const {
    getValidationErrors
} = require('../validations/documentValidator');
class DocumentController {
    //Fetch all documents with paginations
async index(req, res, next) {
    try {
          const sessionUser = req.session.user;
    const userId =
      sessionUser && Number(sessionUser.id) !== 1
        ? Number(sessionUser.id)
        : null;
      const {
        search = "",
        page = 1,
        limit = 10
      } = req.query;


      const documents = await documentService.getAllDocuments({
        search,
        page,
        limit,
        userId
      });

    

      if (
        documents.totalPages > 0 &&
        documents.currentPage > documents.totalPages
      ) {
        return res.redirect(
          `/documents?page=${documents.totalPages}` +
          `&limit=${documents.limit}` +
          `&search=${documents.search}`
        );
      }

     res.render("documents/index", {
        title: "Documents",
        ...documents,
       
      });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }
   


    async create(req, res, next) {

        try {
            const folders = await documentService.findAllDocs();
            const errors = req.session.errors || {};
    const oldInput = req.session.oldInput || {};
    delete req.session.errors;
    delete req.session.oldInput;

    res.render('documents/add', {
        title:"Document add",
        folders,
        errors,
        oldInput,
        csrfToken: req.csrfToken()
    });

        } catch (error) {
            next(error);
        }
    }


 


  async saveFile(req, res, next) {
    try {
        const validation = validationResult(req);

        if (!validation.isEmpty()) {
            const folders = await documentService.findAllDocs();
            if (req.file) fs.unlink(req.file.path, () => {});

            return res.render('documents/add', {
                title: 'Document add',
                folders,
                errors: validation.mapped(),
                oldInput: req.body,
                csrfToken: req.csrfToken()
            });
        }

        const uploadedBy = req.session.user?.id;

        if (!uploadedBy) {
            return res.redirect('/login');
        }

        const data = {
            ...req.body,
            uploaded_by: uploadedBy
        };

        await documentService.createDocument(data, req.file);
          req.session.success = 'Document created successfully';
        return res.redirect('/documents');

    } catch (error) {
        next(error);
    }
}

   async show(req, res, next) {
    try {
        const document = await documentService.getDocumentById(
            req.params.id
        );

        res.render('documents/view', {
            title: 'View Document',
            document
        });

    } catch (error) {
        next(error);
    }
}


    async edit(req, res, next) {
const folders = await documentService.findAllDocs();
        try {
      const errors = req.session.errors || {};
    const oldInput = req.session.oldInput || {};
    delete req.session.errors;
    delete req.session.oldInput;

            const document =
                await documentService.getDocumentById(
                    req.params.id
                );


            res.render('documents/edit', {
        title: 'Document edit',
        document,
        folders,
        csrfToken: req.csrfToken(), 
        errors,
        oldInput
    });

        } catch (error) {
            next(error);
        }
    }


   async update(req, res, next) {
    try {
        const validation = validationResult(req);

        if (!validation.isEmpty()) {
            const folders = await documentService.findAllDocs();
            if (req.file) fs.unlink(req.file.path, () => {});

            return res.render('documents/add', {
                title: 'Document add',
                folders,
                  errors: validation.mapped(),
                oldInput: req.body,
                csrfToken: req.csrfToken()
            });
        }

        const uploadedBy = req.session.user?.id;

        if (!uploadedBy) {
            return res.redirect('/login');
        }

        const data = {
            ...req.body,
            uploaded_by: uploadedBy
        };

        await documentService.updateDocument(req.params.id, data, req.file);

        req.session.success = 'Document updated successfully';
        res.redirect(`/documents`);

    } catch (error) {
        next(error);
    }
}


    async destroy(req, res, next) {

        try {

            await documentService.deleteDocument(
                req.params.id
            );
req.session.success = 'Document deleted successfully';

            res.redirect('/documents');

        } catch (error) {
            next(error);
        }
    }


async preview(req, res, next) {
    const requestInfo = getRequestInfo(req);
    const MIME_TYPES = {
    '.pdf':  'application/pdf',
    '.doc':  'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls':  'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png':  'image/png',
    '.gif':  'image/gif',
    '.webp': 'image/webp',
};
    try {
       if (req.session.user.is_access ==1) {
        const docsLogs = {
            user_id: req.session.user.id,
            document_id:req.params.id,
            folder_id:null,
            action:"document viewed",
            file_name :null,
            file_path:null,
            ip_address: requestInfo.ipAddress,
            user_agent: requestInfo.userAgent
        };
            await documentService.createDocumentLog(docsLogs);
    }
        const document = await documentService.getDocumentById(req.params.id);
        if (!document) {
            return res.status(404).send('Document not found.');
        }

        const storageDir = path.resolve(__dirname, '../../storage/documents');
        const filePath = path.resolve(storageDir, path.basename(document.stored_name));

        // prevent path traversal via a crafted stored_name
        if (!filePath.startsWith(storageDir + path.sep)) {
            return res.status(400).send('Invalid file path.');
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found.');
        }

        const ext = path.extname(document.stored_name).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        res.setHeader(
            'Content-Disposition',
            `inline; filename*=UTF-8''${encodeURIComponent(document.original_name)}`
        );

        res.sendFile(filePath, (err) => {
            if (err) next(err);
        });

    } catch (error) {
        next(error);
    }
}
}


module.exports = new DocumentController();