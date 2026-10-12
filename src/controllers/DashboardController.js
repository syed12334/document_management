const dashboardService = require('../services/DashboardService');
class DashboardController {
    // Get dashboard
    async index(req,res) {
               const sessionUser = req.session.user;
    const userId =
      sessionUser && Number(sessionUser.id) !== 1
        ? Number(sessionUser.id)
        : null;
        const userCount = await dashboardService.getAllUserCount();
        const folderCount = await dashboardService.getAllFolderCount(userId);
        const documentCount = await dashboardService.getAllDocumentCount(userId);
        const roleCount = await dashboardService.getAllRoleCount();
        res.render('dashboard',{
            title:"Dashboard",
            userCount:userCount,
            folderCount:folderCount,
            documentCount:documentCount,
            roleCount:roleCount,
        });
    }
}

module.exports = new DashboardController();

