const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/DashboardController');
// Auth middleware
const auth = require('../middlewares/auth.middleware');
const {
    checkPermission
} = require("../middlewares/permissions.middleware");


// GET /users
router.get('/',auth, dashboard.index);
module.exports = router;