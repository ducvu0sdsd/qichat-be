const reportService = require("../services/report.service")
const responseWithTokens = require("../utils/response")

class ReportController {

    createReport = (req, res) => {
        const { report } = req.body
        reportService.createReport(report)
            .then(report => responseWithTokens(req, res, report, 200))
            .catch(error => {
                return responseWithTokens(req, res, error.Message, 500)
            })
    }

    findAll = (req, res) => {
        reportService.findAll()
            .then(reports => responseWithTokens(req, res, reports, 200))
            .catch(error => {
                return responseWithTokens(req, res, error.Message, 500)
            })
    }

    delete = (req, res) => {
        const { id } = req.params
        reportService.deleteReport(id)
            .then(report => responseWithTokens(req, res, report, 200))
            .catch(error => {
                return responseWithTokens(req, res, error.Message, 500)
            })
    }

    updateSeen = (req, res) => {
        const { id } = req.params
        const { watched } = req.body
        reportService.updateSeen(id, watched)
            .then(report => responseWithTokens(req, res, report, 200))
            .catch(error => {
                return responseWithTokens(req, res, error.Message, 500)
            })
    }
}

module.exports = new ReportController