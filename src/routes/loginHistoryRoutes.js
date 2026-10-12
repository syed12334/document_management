const express = require('express');
const router = express.Router();

const loginHistory = require('../controllers/LoginHistoryController');
const auth = require('../middlewares/auth.middleware');
const {
    checkPermission
} = require("../middlewares/permissions.middleware");
router.get('/', auth, checkPermission('view-user-history'),loginHistory.index);
router.get('/export', auth, checkPermission('download-user-history'), loginHistory.export);

module.exports = router;