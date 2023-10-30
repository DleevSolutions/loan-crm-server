const catchAsync = require('../utils/catchAsync');
const { installmentService } = require('../services');
const httpStatus = require('http-status');

const findAllInstallments = catchAsync(async (req, res) => {
  const results = await installmentService.findAllInstallments(req.query);

  res.status(200).send(results);
});

const findInstallmentDetails = catchAsync(async (req, res) => {
  const results = await installmentService.findInstallmentDetails(req.query);

  res.status(200).send(results);
});

module.exports = {
  findAllInstallments,
  findInstallmentDetails,
};
