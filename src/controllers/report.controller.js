const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');
const httpStatus = require('http-status');

const findReport = catchAsync(async (req, res) => {
  const results = await reportService.findReport(req.query);

  res.status(200).send(results);
});

module.exports = {
  findReport,
};
