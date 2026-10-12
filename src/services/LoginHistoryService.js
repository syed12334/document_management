const loginHistoryRepository = require('../repositories/LoginHistoryRepository');

class LoginHistoryService {


    async getAllLoginHistory({
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
            await loginHistoryRepository.getLoginHistory({
                search,
                page,
                limit
            });

        const totalPages = Math.ceil(count / limit);
        return {
            user_history: rows,
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
     async getLoginHistoryForExport({ search = "" } = {}) {

        return await loginHistoryRepository
            .getLoginHistoryForExport(search);

            
    }
}

module.exports = new LoginHistoryService();