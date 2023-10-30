const catchAsync = require('../utils/catchAsync');
const { paymentsService } = require('../services');
const httpStatus = require('http-status');

const findAllPayments = catchAsync(async (req, res) => {
  const results = await paymentsService.findAllPayments(req.query);

  res.status(200).send(results);
});

const createPayment = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await paymentsService.createPayment(payload);
  res.status(200).send(results);
});

const updatePayment = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await paymentsService.updatePayment(payload);

  res.status(200).send(results);
});

const deletePayment = catchAsync(async (req, res) => {
  await paymentsService.deletePayment(req.query);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  findAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
};
