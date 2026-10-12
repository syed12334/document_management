const authService = require('../services/AuthService');
const { getRequestInfo } = require("../helpers/requestInfo");
const logger = require('../config/logger');
class AuthController {

    async index(req, res, next) {

        try {
            return res.render('auth/login', {
                title: 'Login',
                layout: false,
                errors: {
                email: "",
                password: ""
            },

            old: {
                email: ""
            }
            });
        } catch (error) {
            return next(error);
        }
    }

    async login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await authService.login(email, password);

       const requestInfo = getRequestInfo(req);

        if (!user) {
            return res.status(401).render("auth/login", {
                title: "Login",
                layout: false,
                errors: {
                    email: "Invalid email",
                    password: "Invalid password"
                },
                old: {
                    email
                }
            });
        }
        const userHistory = {
    user_id: user.id,

    login_at: new Date(),
    logout_at:null,

    ip_address: requestInfo.ipAddress,

    user_agent: requestInfo.userAgent,

    device_type: requestInfo.deviceType,

    browser: requestInfo.browser,

    operating_system: requestInfo.operatingSystem,

    login_status: "success",

    failure_reason: null,

    session_id: req.sessionID
};
    await authService.createUserLoginHistory(userHistory);


        req.session.regenerate((err) => {
            if (err) {
                return next(err);
            }

            req.session.user = {
                id: user.id,
                name: user.username,
                email: user.email,
                role: user.role_id,
                is_access: user.is_access,
                permissions: user.role?.permissions
                    ? user.role.permissions.map(
                        permission => permission.name
                    )
                    : []
            };

            req.session.save((err) => {
                if (err) {
                    return next(err);
                }

               return res.redirect("/");
            });
        });

    } catch (error) {

        return res.status(401).render("auth/login", {
            title: "Login",
            layout: false,
            errors: { invalid: error.message || "Invalid email or password" },
            old: {
                email: req.body.email || ""
            }
        });
    }
}



async logout(req, res, next) {

    try {
        const requestInfo = getRequestInfo(req);
 const sessionId = req.sessionID;
        // Update login history BEFORE destroying session
        const userLogoutHistory = {

            user_id: req.session.user.id,
            login_at: new Date(),
            logout_at: new Date(),


            ip_address: requestInfo.ipAddress,

            user_agent: requestInfo.userAgent,

            device_type: requestInfo.deviceType,

            browser: requestInfo.browser,

            operating_system:
                requestInfo.operatingSystem,

            login_status: "logout",

            failure_reason:null,

            session_id: sessionId
        };
        

        const users = await authService.createUserLoginHistory(
            userLogoutHistory
        );
       
        if (!req.session || !req.session.user) {
            return res.redirect("/login");
        }

        req.session.destroy((error) => {

            if (error) {
                return next(error);
            }


            return res.redirect("/login");
        });

    } catch (error) {

        return next(error);

    }
}


}

module.exports = new AuthController();
