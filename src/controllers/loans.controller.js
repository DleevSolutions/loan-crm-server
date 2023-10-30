const catchAsync = require('../utils/catchAsync');
const { loansService } = require('../services');
const httpStatus = require('http-status');

const findAllLoans = catchAsync(async (req, res) => {
  const results = await loansService.findAllLoans(req.query);

  res.status(200).send(results);
});

const findAllArchiveLoans = catchAsync(async (req, res) => {
  const results = await loansService.findAllArchiveLoans(req.query);

  res.status(200).send(results);
});

const createLoan = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await loansService.createLoan(payload);

  res.status(200).send(results);
});

const updateLoan = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await loansService.updateLoan(payload);

  res.status(200).send(results);
});

const deleteLoan = catchAsync(async (req, res) => {
  await loansService.deleteLoan(req.query);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  findAllLoans,
  findAllArchiveLoans,
  createLoan,
  updateLoan,
  deleteLoan,
};
