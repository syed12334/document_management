module.exports = (req, res, next) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    req.user = req.session.user;

    // Available in every EJS file
    res.locals.user = req.user;

    res.locals.permissions = req.user.permissions || [];

    // Helper for EJS
    res.locals.hasPermission = (permission) => {
        return res.locals.permissions.includes(permission);
    };

    next();
};