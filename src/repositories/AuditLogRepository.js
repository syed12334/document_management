const { User, AuditLog, Folder, Document } = require("../models");
const { Op, Sequelize } = require("sequelize");

class AuditLogRepository {

    // Get all user history
    async getAuditLogHistory({
    search = "",
    page,
    limit
}) {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
        where[Op.or] = [
            Sequelize.where(
                Sequelize.cast(
                    Sequelize.col("AuditLog.ip_address"),
                    "TEXT"
                ),
                { [Op.iLike]: `%${search}%` }
            ),
            { action: { [Op.iLike]: `%${search}%` } },
            { user_agent: { [Op.iLike]: `%${search}%` } },
            { "$user.username$": { [Op.iLike]: `%${search}%` } },
            { "$folder.name$": { [Op.iLike]: `%${search}%` } },
            { "$document.original_name$": { [Op.iLike]: `%${search}%` } },
        ];
    }

    const result = await AuditLog.findAndCountAll({
        where,

        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "username"], // adjust to your actual field
                required: false
            },
            {
                model: Folder,
                as: "folder",
                attributes: ["id", "name"],
            },
            {
                model: Document,
                as: "document",
                attributes: ["id", "original_name"],
                required: false
            },
        ],

        limit,
        offset,

        subQuery: false,
        distinct: true,

        // Qualify to the base table to avoid ambiguous "id" across joins
        order: [
            [Sequelize.col("AuditLog.id"), "DESC"]
        ]
    });

    return result;
}


    // Export login history
    async getAuditLogExport(search = "") {

        const where = {};

        if (search) {
             where[Op.or] = [
                Sequelize.where(
                    Sequelize.cast(
                        Sequelize.col("AuditLog.ip_address"),
                        "TEXT"
                    ),
                    { [Op.iLike]: `%${search}%` }
                ),
                { action: { [Op.iLike]: `%${search}%` } },
                { user_agent: { [Op.iLike]: `%${search}%` } },
                { "$user.username$": { [Op.iLike]: `%${search}%` } },
                { "$folder.name$": { [Op.iLike]: `%${search}%` } },
                { "$document.original_name$": { [Op.iLike]: `%${search}%` } },
            ];
        }

        return await AuditLog.findAll({

            where,

             include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "username"], // adjust to your actual field
                required: false
            },
            {
                model: Folder,
                as: "folder",
                attributes: ["id", "name"],
            },
            {
                model: Document,
                as: "document",
                attributes: ["id", "original_name"],
                required: false
            },
        ],

            order: [
                ["created_at", "asc"]
            ],

            raw: false
        });
    }
}

module.exports = new AuditLogRepository();