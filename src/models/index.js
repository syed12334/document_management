const sequelize = require("../config/database");
const User = require("./User");
const Role = require("./Role");
const Permission = require("./Permission");
const Role_permission = require("./Role_permission");
const UserLoginHistory = require("./UserLoginHistory");
const Folder = require("./Folder");
const Document = require("./Document");
const AuditLog = require("./AuditLogs");
const FolderUser = require("./FolderUser");




// ========================================
// User -> Role
// ========================================

User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role"
});

Role.hasMany(User, {
    foreignKey: "role_id",
    as: "users"
});


// ========================================
// Role <-> Permission
// Many-to-Many through role_permissions
// ========================================

Role.belongsToMany(Permission, {
    through: Role_permission,
    foreignKey: "role_id",
    otherKey: "permission_id",
    as: "permissions"
});

Permission.belongsToMany(Role, {
    through: Role_permission,
    foreignKey: "permission_id",
    otherKey: "role_id",
    as: "roles"
});


// ========================================
// Optional direct relationships
// RolePermission -> Role
// RolePermission -> Permission
// ========================================

Role_permission.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role"
});

Role_permission.belongsTo(Permission, {
    foreignKey: "permission_id",
    as: "permission"
});


// ========================================
// User -> Login History
// ========================================

User.hasMany(UserLoginHistory, {
    foreignKey: "user_id",
    as: "loginHistories"
});
// ========================================
// User -> Folder
// ========================================
User.hasMany(Folder, {
    foreignKey: "created_by",
    as: "folder"
});


// ========================================
// Login History -> User
// ========================================

UserLoginHistory.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

// ========================================
// Folder -> folder
// ========================================
    Folder.belongsTo(Folder, {
      foreignKey: 'parent_id',
      as: 'parent'
    });

    // ========================================
// Folder -> folder belongs
// ========================================

    Folder.hasMany(Folder, {
      foreignKey: 'parent_id',
      as: 'children'
    });

    // ========================================
// Folder -> user
// ========================================

    Folder.belongsTo(User, {
      foreignKey: 'created_by',
      as: 'user'
    });

// Folder → Documents
Folder.hasMany(Document, {
    foreignKey: 'folder_id',
    as: 'documents'
});

//Folder - Folderuser
    Folder.hasMany(FolderUser, {
      foreignKey: 'folder_id',
      as: 'folderuser'
    });

Document.belongsTo(Folder, {
    foreignKey: 'folder_id',
    as: 'folder'
});


// User → Documents uploaded by user
User.hasMany(Document, {
    foreignKey: 'uploaded_by',
    as: 'uploadedDocuments'
});

Document.belongsTo(User, {
    foreignKey: 'uploaded_by',
    as: 'user'
});


// ========================================
// AuditLog -> User
// ========================================

AuditLog.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasMany(AuditLog, {
    foreignKey: 'user_id',
    as: 'auditLogs'
});


// ========================================
// AuditLog -> Document
// ========================================

AuditLog.belongsTo(Document, {
    foreignKey: 'document_id',
    as: 'document'
});

Document.hasMany(AuditLog, {
    foreignKey: 'document_id',
    as: 'auditLogs'
});


// ========================================
// AuditLog -> Folder
// ========================================

AuditLog.belongsTo(Folder, {
    foreignKey: 'folder_id',
    as: 'folder'
});

Folder.hasMany(AuditLog, {
    foreignKey: 'folder_id',
    as: 'auditLogs'
});
// Folder user 
FolderUser.belongsTo(Folder, {
    foreignKey: 'folder_id',
    as: 'folder'
});

// Folder user 
FolderUser.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = {
    sequelize,
    User,
    Role,
    Permission,
    UserLoginHistory,
    Folder,
    Document,
    AuditLog,
    FolderUser,
    Role_permission
};