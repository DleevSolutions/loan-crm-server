const createReportDao = require('../dao/report.dao');
const reportDao = createReportDao();

const findReport = async (query) => {
  const results = await reportDao.findReport(query);
  return results;
};

module.exports = {
  findReport,
};
