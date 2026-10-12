const auditLogRepository = require('../repositories/AuditLogRepository');

class AuditLogService {
    async getAllAuditLog({
        search="",
        page = 1,
        limit = 10
    }) {
        page = Number(page);
        limit = Number(limit);

        if (!Number.isInteger(page) || page < 1) {
            page = 1;
        }

        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            limit = 10;
        }

        search = String(search).trim();

        const { count, rows } =
            await auditLogRepository.getAuditLogHistory({
                search,
                page,
                limit
            });

        const totalPages = Math.ceil(count / limit);
        return {
            auditLogs: rows,
            totalUsers: count,
            currentPage: page,
            limit,
            totalPages,
            search,

            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages,

            previousPage: page - 1,
            nextPage: page + 1
        };
    }
    async getAuditLogExport({ search = "" } = {}) {
        return await auditLogRepository
            .getAuditLogExport(search);
    }
}

module.exports = new AuditLogService();