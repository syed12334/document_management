const { body } = require("express-validator");

const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({
            min: 5,
            max: 20
        })
        .withMessage("Password must be between 5 and 20 characters")
];

module.exports = {
    loginValidator
};
