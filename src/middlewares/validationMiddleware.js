const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errors = {};

        result.array().forEach((error) => {
            if (!errors[error.path]) {
                errors[error.path] = error.msg;
            }
        });

        return res.status(422).render("auth/login", {
            title: "Login",
            layout: false,

            errors,

            old: {
                email: req.body.email || ""
            }
        });
    }

    next();
};
