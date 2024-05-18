const reportModel = require("../models/report.model")


class ReportService {

    createReport = async (report) => {
        return await reportModel.create(report)
    }

    findAll = async () => {
        return await reportModel.find().lean()
    }

    deleteReport = async (id) => {
        return await reportModel.findByIdAndDelete(id)
    }

    updateSeen = async (id, watched) => {
        return await reportModel.updateOne({ _id: id }, { $set: { watched: watched } })
    }

}

module.exports = new ReportService