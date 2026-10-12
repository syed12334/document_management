const auditLogService = require("../services/AuditLogService");
const ExcelJS = require("exceljs");

class AuditLogController {

    // Login history listing
    async index(req, res, next) {
        try {
            const {
                search = "",
                page = 1,
                limit = 10
            } = req.query;

            const data = await auditLogService.getAllAuditLog({
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
                    `/audit/logs?page=${data.totalPages}` +
                    `&limit=${data.limit}` +
                    `&search=${encodeURIComponent(data.search)}`
                );
            }

            return res.render("audit_logs/index", {
                title: "Audit logs",
                ...data
            });

        } catch (error) {
            next(error);
        }
    }

    // Export login history
    async export(req, res, next) {
    try {
        const { search = "" } = req.query;

        // Get login history from service
        const auditLogs = await auditLogService.getAuditLogExport({ search });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Audit Logs");

        // Define columns (added created_at since we format it below)
        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "User Name", key: "user_name", width: 25 },
            { header: "Folder Name", key: "folder_name", width: 25 },
            { header: "Document Name", key: "document_name", width: 40 },
            { header: "IP Address", key: "ip_address", width: 20 },
            { header: "User Agent", key: "user_agent", width: 15 },
            { header: "Action", key: "action", width: 20 },
            { header: "Created At", key: "created_at", width: 20 }
        ];

        // Add rows
        auditLogs.forEach(audit => {
            worksheet.addRow({
                id: audit.id,
                user_name: audit.user?.username || "",
                folder_name: audit.folder?.name || "",
                document_name: audit.document?.original_name || "", // fixed: was audit.user?.original_name
                ip_address: audit.ip_address || "",
                user_agent: audit.user_agent || "",
                action: audit.action || "",
                created_at: audit.created_at || ""
            });
        });

        // Header styling
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "4472C4" }
        };
        headerRow.alignment = { vertical: "middle", horizontal: "center" };

        // Date formatting - now valid since "created_at" column exists
        worksheet.getColumn("created_at").numFmt = "dd-mm-yyyy hh:mm:ss";

        // Freeze header row
        worksheet.views = [{ state: "frozen", ySplit: 1 }];

        // Enable filter - fixed range to match actual number of columns (A-H)
        worksheet.autoFilter = {
            from: "A1",
            to: "H1"
        };

        // Excel response headers
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="audit-logs.xlsx"'
        );

        await workbook.xlsx.write(res);
        return res.end();
    } catch (error) {
        return next(error);
    }
}
}

module.exports = new AuditLogController();