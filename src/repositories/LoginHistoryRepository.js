const { User, UserLoginHistory } = require("../models");
const { Op, Sequelize } = require("sequelize");

class LoginHistoryRepository {

    // Get all user history
    async getLoginHistory({
    search = "",
    page = 1,
    limit = 10
}) {
    const offset = (page - 1) * limit;
    const term = search.trim();

    const where = {};

    if (term) {
        const like = { [Op.iLike]: `%${term}%` };

        where[Op.or] = [
            // PostgreSQL INET must be cast to text
            Sequelize.where(
                Sequelize.cast(
                    Sequelize.col("UserLoginHistory.ip_address"),
                    "TEXT"
                ),
                like
            ),

            { login_status: like },
            { browser: like },
            { device_type: like },
            { operating_system: like },

            // Search on the joined User table (alias must match `as: "user"`)
            { "$user.username$": like }
        ];
    }

    const result = await UserLoginHistory.findAndCountAll({
        where,

        include: [
            {
                model: User,
                as: "user",
                required: false
                // attributes: ["id", "username", "email"], // optional: avoid returning sensitive fields like password
            }
        ],

        limit,
        offset,

        order: [["id", "DESC"]],

        // Keeps the JOIN in the main query so "$user.username$" resolves
        // correctly together with limit/offset
        subQuery: false
    });

    return result;
}


    // Export login history
    async getLoginHistoryForExport(search = "") {

        const where = {};

        if (search) {
            where[Op.or] = [
                Sequelize.where(
                    Sequelize.cast(
                        Sequelize.col("UserLoginHistory.ip_address"),
                        "TEXT"
                    ),
                    {
                        [Op.iLike]: `%${search}%`
                    }
                ),

                {
                    login_status: {
                        [Op.iLike]: `%${search}%`
                    }
                },

                {
                    browser: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            ];
        }

        return await UserLoginHistory.findAll({

            where,

            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "username",
                        "email"
                    ]
                }
            ],

            order: [
                ["login_at", "DESC"]
            ],

            raw: false
        });
    }
}

module.exports = new LoginHistoryRepository();