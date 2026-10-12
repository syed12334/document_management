
const {
    User,
    Role,
    Permission
} = require("../models");


/**
 * Load logged-in user's permissions
 *
 * This middleware should run AFTER auth.middleware
 */
const loadPermissions = async (req, res, next) => {

    try {

        // User not logged in
        if (!req.session.user || !req.session.user.id) {

            req.userRole = null;
            req.permissions = [];

            res.locals.userRole = null;
            res.locals.permissions = [];

            return next();
        }


        // Load user + role + permissions
        const user = await User.findByPk(req.session.user.id, {

            include: [
                {
                    model: Role,
                    as: "role",

                    include: [
                        {
                            model: Permission,
                            as: "permissions",

                            attributes: [
                                "id",
                                "name"
                            ],

                            through: {
                                attributes: []
                            }
                        }
                    ]
                }
            ]
        });


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }


        // Get permissions
        const permissions =
            user.role?.permissions || [];


        // Store on request
        req.userRole = user.role;
        req.permissions = permissions;


        // Make available to EJS
        res.locals.userRole = user.role;

        res.locals.permissions = permissions;


        next();

    } catch (error) {

        console.error(
            "Load permissions error:",
            error
        );

        next(error);
    }
};


/**
 * Check permission for a route
 *
 * Example:
 *
 * router.get(
 *     "/",
 *     checkPermission("view-user"),
 *     controller.index
 * );
 */
const checkPermission = (requiredPermission) => {

    return async (req, res, next) => {

        try {

            // Check authentication
            if (!req.session.user || !req.session.user.id) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthenticated"
                });
            }

            const user = await User.findByPk(
                req.session.user.id,
                {
                    include: [
                        {
                            model: Role,
                            as: "role", // IMPORTANT: lowercase
                            include: [
                                {
                                    model: Permission,
                                    as: "permissions",
                                    attributes: [
                                        "id",
                                        "name"
                                    ],
                                    through: {
                                        attributes: []
                                    }
                                }
                            ]
                        }
                    ]
                }
            );

            if (!user) {
               return res.status(403).render(
                    "errors/403",
                    {
                        title: "User not found"
                    }
                );
            }

        

            const permissions =
                user.role?.permissions || [];

            const hasPermission =
                permissions.some(
                    permission =>
                        permission.name === requiredPermission
                );

            if (!hasPermission) {
                return res.status(403).render(
                    "errors/403",
                    {
                        title: "Access Denied"
                    }
                );
            }

            req.userRole = user.role;
            req.permissions = permissions;

            next();

        } catch (error) {

            console.error(
                "Permission middleware error:",
                error
            );

            next(error);
        }
    };
};


/**
 * EJS helper
 *
 * Usage:
 *
 * <% if (can("view-user")) { %>
 *     ...
 * <% } %>
 */
const permissionHelper = (req, res, next) => {

    res.locals.can = (permissionName) => {

        const permissions =
            req.permissions || [];


        return permissions.some(
            permission =>
                permission.name ===
                permissionName
        );
    };


    next();
};


module.exports = {
    loadPermissions,
    checkPermission,
    permissionHelper
};

