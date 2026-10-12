const loginHistoryService = require("../services/LoginHistoryService");
const ExcelJS = require("exceljs");

class LoginHistoryController {

    // Login history listing
    async index(req, res, next) {
        try {
            const {
                search = "",
                page = 1,
                limit = 10
            } = req.query;

            const data = await loginHistoryService.getAllLoginHistory({
                search,
                page,
                limit
            });
            // Keep page inside valid range
            if (
                data.totalPages > 0 &&
                data.currentPage > data.totalPages
            ) {
                return res.redirect(
                    `/user/login/logs?page=${data.totalPages}` +
                    `&limit=${data.limit}` +
                    `&search=${encodeURIComponent(data.search)}`
                );
            }

            return res.render("user_history/index", {
                title: "User Logs History",
                ...data
            });

        } catch (error) {
            next(error);
        }
    }

    // Export login history
    async export(req, res, next) {
        try {

            const {
                search = ""
            } = req.query;

            // Get login history from service
            const loginHistories =
                await loginHistoryService.getLoginHistoryForExport({
                    search
                });

 // Create workbook
            const workbook = new ExcelJS.Workbook();

            // Create worksheet
            const worksheet =
                workbook.addWorksheet("Login History");

            // Define columns
            worksheet.columns = [
                {
                    header: "ID",
                    key: "id",
                    width: 10
                },
                {
                    header: "User Name",
                    key: "user_name",
                    width: 25
                },
                {
                    header: "Email",
                    key: "email",
                    width: 35
                },
                {
                    header: "Login At",
                    key: "login_at",
                    width: 22
                },
                {
                    header: "Logout At",
                    key: "logout_at",
                    width: 22
                },
                {
                    header: "IP Address",
                    key: "ip_address",
                    width: 20
                },
                {
                    header: "Device",
                    key: "device_type",
                    width: 15
                },
                {
                    header: "Browser",
                    key: "browser",
                    width: 20
                },
                {
                    header: "Operating System",
                    key: "operating_system",
                    width: 25
                },
                {
                    header: "Status",
                    key: "login_status",
                    width: 15
                }
            ];

            // Add rows
            loginHistories.forEach(history => {

                worksheet.addRow({
                    id: history.id,

                    user_name:
                        history.user?.username || "",

                    email:
                        history.user?.email || "",

                    login_at:
                        history.login_at
                            ? new Date(history.login_at)
                            : null,

                    logout_at:
                        history.logout_at
                            ? new Date(history.logout_at)
                            : null,

                    ip_address:
                        history.ip_address || "",

                    device_type:
                        history.device_type || "",

                    browser:
                        history.browser || "",

                    operating_system:
                        history.operating_system || "",

                    login_status:
                        history.login_status || ""
                });

            });

            // Header styling
            const headerRow = worksheet.getRow(1);

            headerRow.font = {
                bold: true,
                color: {
                    argb: "FFFFFF"
                }
            };

            headerRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "4472C4"
                }
            };

            headerRow.alignment = {
                vertical: "middle",
                horizontal: "center"
            };

            // Date formatting
            worksheet.getColumn("login_at").numFmt =
                "dd-mm-yyyy hh:mm:ss";

            worksheet.getColumn("logout_at").numFmt =
                "dd-mm-yyyy hh:mm:ss";

            // Freeze header row
            worksheet.views = [
                {
                    state: "frozen",
                    ySplit: 1
                }
            ];

            // Enable filter
            worksheet.autoFilter = {
                from: "A1",
                to: "J1"
            };

            // Excel response headers
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            res.setHeader(
                "Content-Disposition",
                'attachment; filename="login-history.xlsx"'
            );

            // Write workbook to browser
            await workbook.xlsx.write(res);

            return res.end();
        } catch (error) {
           

            return next(error);
        }
    }
}

module.exports = new LoginHistoryController();