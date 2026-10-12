const path = require('path');
const fs = require('fs').promises;


const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage/documents');
const documentRepository =
    require('../repositories/DocumentRepository');

const {
    validateDocumentFile,
    validateDocumentData
} = require('../validations/documentValidator');


class DocumentService {

  

   async getAllDocuments({
  search = "",
  page = 1,
  limit = 10,
  userId=null
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
    await documentRepository.findAllDocument({
      search,
      page,
      limit,
      userId
    });

  const totalPages = Math.ceil(count / limit);

  // Convert Sequelize instances to plain objects BEFORE spreading,
  // otherwise fields like original_name/file_extension can be dropped
  const documents = rows.map(doc => {
    const plain = doc.get({ plain: true });

    return {
      ...plain,
      file_size: plain.file_size ?? 0,
      created_at: plain.created_at ?? null,
      updated_at: plain.updated_at ?? null
    };
  });

  return {
    documents,
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

    async getDocumentById(id) {

        const document =
            await documentRepository.findById(id);

        if (!document) {
            throw new Error('Document not found.');
        }

        return document;
    }


    async getDocumentsByFolder(folderId) {

        return await documentRepository.findByFolderId(
            folderId
        );
    }


     async createDocument(data, file) {

    const extension =
        path.extname(file.originalname)
            .toLowerCase();

    const documentData = {

        folder_id: Number(data.folder_id),

        uploaded_by: Number(data.uploaded_by),

        original_name:
            file.originalname,

        stored_name:
            file.filename,

        file_path:
            `/uploads/documents/${file.filename}`,

        mime_type:
            file.mimetype,

        file_size:
            file.size,

        file_extension:
            extension,

        is_encrypted:
            data.is_encrypted === 'true' ||
            data.is_encrypted === true
    };

    return await documentRepository.create(
        documentData
    );
}


//    async updateDocument(id, data, file) {
//     const documentData = {
//         folder_id: Number(data.folder_id),
//         uploaded_by: Number(data.uploaded_by),
//         is_encrypted: data.is_encrypted === 'true' || data.is_encrypted === true
//     };

//     // Only touch file-related fields if a new file was actually uploaded
//     if (file) {
//         documentData.original_name = file.originalname;
//         documentData.stored_name = file.filename;
//         documentData.file_path = `/storage/documents/${file.filename}`;
//         documentData.mime_type = file.mimetype;
//         documentData.file_size = file.size;
//         documentData.file_extension = path.extname(file.originalname).toLowerCase();
//     }

//     return await documentRepository.update(id, documentData);
// }

async updateDocument(id, data, file) {
    // Fetch the existing record first so we know what old file to remove
    const existingDocument = await documentRepository.findById(id);

    if (!existingDocument) {
        if (file) fs.unlink(file.path, () => {});
        throw new Error('Document not found');
    }

    const documentData = {
        folder_id: Number(data.folder_id),
        uploaded_by: Number(data.uploaded_by),
        is_encrypted: data.is_encrypted === 'true' || data.is_encrypted === true
    };

    // Only touch file-related fields if a new file was actually uploaded
    if (file) {
        documentData.original_name = file.originalname;
        documentData.stored_name = file.filename;
        documentData.file_path = `/storage/documents/${file.filename}`;
        documentData.mime_type = file.mimetype;
        documentData.file_size = file.size;
        documentData.file_extension = path.extname(file.originalname).toLowerCase();
    }

    const updatedDocument = await documentRepository.update(id, documentData);

    // Delete the old physical file only after the DB update succeeds,
    // and only if a new file actually replaced it.
    if (file && existingDocument.file_path) {
        const oldFilePath = path.join(
            process.cwd(),
            existingDocument.file_path.replace(/^\/+/, '') // strip leading slash
        );

        fs.unlink(oldFilePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Failed to delete old document file:', oldFilePath, err);
            }
        });
    }

    return updatedDocument;
}

// ---------- Service ----------
async deleteDocument(id) {
    const document = await documentRepository.findById(id);

    if (!document) {
        throw new Error('Document not found.');
    }

    // Delete the physical file first
    // Use whichever field actually stores the filename/path, e.g. document.filename or document.path
    const filePath = path.join(STORAGE_DIR, document.stored_name);

    try {
        await fs.unlink(filePath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // File already missing on disk — log it but don't block DB cleanup
            console.warn(`File not found on disk, skipping: ${filePath}`);
        } else {
            // Any other error (permissions, etc.) should stop the deletion
            throw err;
        }
    }

    // Then remove the DB record
    await documentRepository.delete(id);

    return true;
}
    // async deleteDocument(id) {

    //     const document =
    //         await documentRepository.findById(id);

    //     if (!document) {
    //         throw new Error('Document not found.');
    //     }




    //     await documentRepository.delete(id);


    //     return true;
    // }
    async findAllDocs() {
        return await documentRepository.findAllFolders();
    }
    // Create document logs
	async createDocumentLog(data) {
		return await documentRepository.createAuditLog(data);
	}
}


module.exports = new DocumentService();