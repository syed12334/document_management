const express = require('express');
const router = express.Router();

const auditLog = require('../controllers/AuditLogController');
const auth = require('../middlewares/auth.middleware');
const {
    checkPermission
} = require("../middlewares/permissions.middleware");
// GET /users
router.get('/', auth, checkPermission('view-audit-logs'),auditLog.index);
router.get('/export', auth, checkPermission('download-audit-logs'), auditLog.export);

module.exports = router;