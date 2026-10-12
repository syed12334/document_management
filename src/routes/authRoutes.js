const express = require('express');
const router = express.Router();
const loginRateLimiter = require('../middlewares/loginRateLimiter');
const authController = require('../controllers/AuthController');
const validationMiddleware =
    require("../middlewares/validationMiddleware");

const {
    loginValidator
} = require("../validations/loginValidation");
// GET /users
router.get('/', authController.index);
router.post('/authenticate',loginRateLimiter,loginValidator,validationMiddleware, authController.login);
router.get('/logout', authController.logout);

module.exports = router;