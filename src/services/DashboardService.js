const dashRepository = require('../repositories/DashboardRepository');

class DashboardService {

    // Get total user count
    async getAllUserCount() {
        return await dashRepository.getAllUserCount();
    }
    
    // Get total folder count
    async getAllFolderCount(userId) {
        return await dashRepository.getFolderCount(userId);
    }

      
    // Get total document count
    async getAllDocumentCount(userId) {
        return await dashRepository.findAllDocumentCount(userId);
    }
      
    // Get total role count
    async getAllRoleCount() {
        return await dashRepository.getAllRoleCount();
    }
}

module.exports = new DashboardService();