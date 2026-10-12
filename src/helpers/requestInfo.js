const requestIp = require("request-ip");
const UAParser = require("ua-parser-js");

const getRequestInfo = (req) => {
    const ip = requestIp.getClientIp(req);

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    let deviceType = "desktop";

    if (result.device.type === "mobile") {
        deviceType = "mobile";
    } else if (result.device.type === "tablet") {
        deviceType = "tablet";
    } else if (result.device.type === "smarttv") {
        deviceType = "smart-tv";
    } else if (result.device.type === "wearable") {
        deviceType = "wearable";
    } else if (result.device.type === "console") {
        deviceType = "console";
    } else if (result.device.type === "embedded") {
        deviceType = "embedded";
    }

    return {
        ipAddress: ip,

        userAgent: req.headers["user-agent"] || null,

        deviceType,

        deviceVendor: result.device.vendor || null,

        deviceModel: result.device.model || null,

        browser: result.browser.name || null,

        browserVersion: result.browser.version || null,

        operatingSystem: result.os.name || null,

        operatingSystemVersion: result.os.version || null,

        cpu: result.cpu.architecture || null
    };
};

module.exports = {
    getRequestInfo
};