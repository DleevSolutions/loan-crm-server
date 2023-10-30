const catchAsync = require('../utils/catchAsync');
const { expensesService } = require('../services');
const httpStatus = require('http-status');

const findAllExpenses = catchAsync(async (req, res) => {
  const results = await expensesService.findAllExpenses(req.query);

  res.status(200).send(results);
});

const createExpenses = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await expensesService.createExpenses(payload);

  res.status(200).send(results);
});

const updateExpenses = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await expensesService.updateExpenses(payload);

  res.status(200).send(results);
});

const deleteExpenses = catchAsync(async (req, res) => {
  await expensesService.deleteExpenses(req.query);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  findAllExpenses,
  createExpenses,
  updateExpenses,
  deleteExpenses,
};
