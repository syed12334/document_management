const { body } = require('express-validator');

// Shared username rules
const usernameRules = () =>
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage('User name can only contain letters and numbers')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters');

// Shared email rules
const emailRules = () =>
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail();

// Shared role rules
const roleRules = () =>
    body('role_id')
        .notEmpty()
        .withMessage('Role is required')
        .isInt({ min: 1 })
        .withMessage('Invalid role');

// Password strength checks, applied to a `body('password')` chain
const passwordStrength = (chain) =>
    chain
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=~`]/)
        .withMessage('Password must contain at least one special character');

const createUserValidator = [
    usernameRules(),
    emailRules(),

    // Create: password is required
    passwordStrength(
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ),

    roleRules(),
];

const updateUserValidator = [
    usernameRules(),
    emailRules(),
    passwordStrength(
        body('password')
            .optional({ checkFalsy: true })
    ),

    roleRules(),
];

module.exports = {
    createUserValidator,
    updateUserValidator
};